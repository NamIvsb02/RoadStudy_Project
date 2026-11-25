// Dọn file mồ côi: file đã upload nhưng không còn bản ghi nào trong DB trỏ tới.
// Nguyên nhân thường gặp: server sập giữa lúc upload, giáo viên upload ảnh bìa rồi bỏ form không lưu, xóa file cũ lỗi.
//
//   node scripts/cleanup-orphan-files.js            # chỉ liệt kê (dry-run)
//   node scripts/cleanup-orphan-files.js --apply    # xóa thật
//   Tùy chọn: --min-age-hours=24 (mặc định 24: không xóa file mới upload, vì có thể người dùng đang điền form)
//
// Script chỉ ĐỌC database; chỉ xóa file (local hoặc Cloudinary theo STORAGE_DRIVER) trong thư mục của môi trường hiện tại.
// Chống race với upload đang chạy: (1) liệt kê file TRƯỚC rồi mới đọc DB, (2) bỏ qua file mới hơn min-age,
// (3) kiểm tra lại DB ngay trước khi xóa từng file.
const fs = require("fs");
const path = require("path");

const FIELDS = [
  ["account", "avatarUrl"],
  ["course", "coverImageUrl"],
  ["resource", "fileUrl"],
  ["invoice", "paymentProofUrl"],
];
const CLOUD_KINDS = [
  ["image", "upload"],
  ["image", "authenticated"],
  ["raw", "upload"],
];

const loadReferences = async (prisma) => {
  const refs = [];
  for (const [model, field] of FIELDS) {
    const rows = await prisma[model].findMany({ select: { [field]: true } });
    refs.push(...rows.map((row) => row[field]).filter(Boolean));
  }
  return refs;
};

// Có bản ghi nào đang chứa chuỗi này không (đọc lại DB ngay trước khi xóa)
const isStillReferenced = async (prisma, needle) => {
  for (const [model, field] of FIELDS) {
    if (await prisma[model].findFirst({ where: { [field]: { contains: needle } }, select: { id: true } })) return true;
  }
  return false;
};

const walk = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]))
    : [];

async function listCloudinary(cloudinary, folder) {
  const found = [];
  for (const [resourceType, type] of CLOUD_KINDS) {
    let cursor;
    do {
      const page = await cloudinary.api.resources({ resource_type: resourceType, type, prefix: `${folder}/`, max_results: 500, next_cursor: cursor });
      found.push(...page.resources.map((item) => ({ ...item, resourceType, type })));
      cursor = page.next_cursor;
    } while (cursor);
  }
  return found;
}

// deps: { prisma, storage, cloudinary? (bắt buộc khi driver cloudinary), uploadRoot?, now?, log? }
async function cleanup({ apply = false, minAgeMs = 24 * 3600 * 1000, prisma, storage, cloudinary, uploadRoot = storage.UPLOAD_ROOT, now = Date.now, log = console.log }) {
  const driver = storage.driver();
  log(`${apply ? "CHẾ ĐỘ XÓA THẬT" : "CHẾ ĐỘ XEM TRƯỚC (dry-run), thêm --apply để xóa"} | lưu trữ: ${driver} | chỉ xóa file cũ hơn ${minAgeMs / 3600000} giờ\n`);
  const result = { scanned: 0, orphans: 0, deleted: 0, failed: 0, keptOnRecheck: 0, outOfScope: 0 };

  // 1. Liệt kê file TRƯỚC (lỗi ở đây thì dừng, chưa xóa gì)
  let candidates;
  if (driver === "cloudinary") {
    const folder = storage.baseFolder();
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const assets = await listCloudinary(cloudinary, folder);
    result.scanned = assets.length;
    candidates = [];
    for (const asset of assets) {
      // Phòng thủ: chỉ xử lý file đúng thư mục môi trường hiện tại và đúng cloud đang cấu hình
      const inScope = asset.public_id.startsWith(`${folder}/`) && (!asset.secure_url || !cloudName || asset.secure_url.includes(`/res.cloudinary.com/${cloudName}/`));
      if (!inScope) {
        result.outOfScope++;
        continue;
      }
      candidates.push({ id: asset.public_id, needle: asset.public_id, createdAt: new Date(asset.created_at).getTime(), asset });
    }
    log(`Đã quét ${assets.length} file trong ${folder}/`);
  } else {
    const root = path.resolve(uploadRoot);
    const files = walk(root);
    result.scanned = files.length;
    candidates = files.map((file) => ({ id: path.relative(root, file).split(path.sep).join("/"), needle: path.basename(file), createdAt: fs.statSync(file).mtimeMs, file }));
    log(`Đã quét ${files.length} file trong ${root}`);
  }

  // 2. Đọc DB SAU khi liệt kê: file nào đã được gắn vào DB trước thời điểm này đều được giữ (lỗi DB thì dừng, chưa xóa gì)
  const refs = await loadReferences(prisma);
  log(`DB đang tham chiếu ${refs.length} file`);
  const used = driver === "cloudinary"
    ? new Set(refs.map((ref) => storage.parseCloudinaryUrl(ref)?.publicId).filter(Boolean))
    : new Set(refs.filter((ref) => !storage.isUrl(ref)).map((ref) => ref.replace(/^\/?uploads\//, "")));

  const orphans = candidates.filter((c) => !used.has(c.id) && now() - c.createdAt > minAgeMs);
  result.orphans = orphans.length;

  // 3. Kiểm tra lại DB ngay trước khi xóa từng file
  for (const orphan of orphans) {
    if (!apply) {
      log(`  SẼ XÓA  ${orphan.id}`);
      continue;
    }
    try {
      if (await isStillReferenced(prisma, orphan.needle)) {
        result.keptOnRecheck++;
        log(`  GIỮ LẠI (vừa được dùng)  ${orphan.id}`);
        continue;
      }
      if (orphan.asset) await cloudinary.uploader.destroy(orphan.asset.public_id, { resource_type: orphan.asset.resourceType, type: orphan.asset.type, invalidate: true });
      else await fs.promises.unlink(orphan.file);
      result.deleted++;
      log(`  ĐÃ XÓA  ${orphan.id}`);
    } catch (err) {
      result.failed++;
      log(`  LỖI XÓA  ${orphan.id}  ${err.message}`);
    }
  }
  log(`\n${apply ? `Đã xóa ${result.deleted}, giữ lại ${result.keptOnRecheck}, lỗi ${result.failed}` : `Sẽ xóa ${result.orphans}`} trên ${result.orphans} file mồ côi`);
  return result;
}

module.exports = { cleanup, FIELDS };

if (require.main === module) {
  require("dotenv").config({ quiet: true });
  const prisma = require("../src/config/database");
  const storage = require("../src/utils/storage");
  const ageArg = process.argv.find((arg) => arg.startsWith("--min-age-hours="));
  let cloudinary;
  if (storage.driver() === "cloudinary") {
    cloudinary = require("cloudinary").v2;
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
  }
  cleanup({ apply: process.argv.includes("--apply"), minAgeMs: (ageArg ? Number(ageArg.split("=")[1]) : 24) * 3600 * 1000, prisma, storage, cloudinary })
    .then(async (result) => {
      await prisma.$disconnect();
      process.exit(result.failed ? 1 : 0);
    })
    .catch(async (err) => {
      console.error("Lỗi:", err.message);
      await prisma.$disconnect().catch(() => {});
      process.exit(1);
    });
}
