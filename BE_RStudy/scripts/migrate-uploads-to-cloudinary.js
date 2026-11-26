// Chạy MỘT LẦN: đưa các file đang lưu local (BE_RStudy/uploads) lên Cloudinary rồi đổi đường dẫn trong DB.
//
//   node scripts/migrate-uploads-to-cloudinary.js            # chỉ in kế hoạch (không ghi gì, không cần key)
//   node scripts/migrate-uploads-to-cloudinary.js --apply    # cần STORAGE_DRIVER=cloudinary: upload và cập nhật DB
//
// Script GHI vào database dùng chung nên chỉ chạy --apply khi Nam đồng ý, và nên chạy dry-run trước.
// An toàn khi chạy lại (idempotent): bản ghi đã là URL Cloudinary bị bỏ qua; mỗi bản ghi chỉ đổi khi giá trị cũ chưa
// thay đổi. Ghi DB lỗi hoặc giá trị vừa bị đổi thì xóa file vừa upload. Script KHÔNG xóa file local.
const fs = require("fs");
const path = require("path");

// Mỗi mục: model Prisma, trường chứa đường dẫn, thư mục lưu trên Cloudinary, có riêng tư không
const TARGETS = [
  { model: "account", field: "avatarUrl", folder: "avatars", isPrivate: false },
  { model: "course", field: "coverImageUrl", folder: "covers", isPrivate: false },
  { model: "resource", field: "fileUrl", folder: "resources", isPrivate: false },
  { model: "invoice", field: "paymentProofUrl", folder: "proofs", isPrivate: true },
];

// deps: { prisma, storage, uploadRoot?, log? }. Trả về số liệu tổng kết.
async function migrate({ apply = false, prisma, storage, uploadRoot = storage.UPLOAD_ROOT, log = console.log }) {
  if (apply && storage.driver() !== "cloudinary") throw new Error("Chạy với --apply cần STORAGE_DRIVER=cloudinary và 3 biến CLOUDINARY_*");
  const mimeByExt = Object.fromEntries(Object.entries(storage.EXTENSIONS).map(([mime, ext]) => [ext, mime]));
  const root = path.resolve(uploadRoot);
  log(apply ? "CHẾ ĐỘ GHI: sẽ upload và cập nhật DB\n" : "CHẾ ĐỘ XEM TRƯỚC (dry-run): không ghi gì, thêm --apply để thực hiện\n");

  const summary = { migrated: 0, planned: 0, missing: 0, skipped: 0, failed: 0 };
  for (const { model, field, folder, isPrivate } of TARGETS) {
    const rows = (await prisma[model].findMany({ select: { id: true, [field]: true } })).filter((row) => row[field]);
    log(`[${model}.${field}] ${rows.length} bản ghi có giá trị`);
    for (const row of rows) {
      const ref = row[field];
      if (storage.isUrl(ref)) {
        summary.skipped++;
        continue;
      }
      const file = path.resolve(root, ref.replace(/^\/?uploads\//, ""));
      if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) {
        log(`  THIẾU FILE  ${model}#${row.id}  ${ref}`);
        summary.missing++;
        continue;
      }
      const mimetype = mimeByExt[path.extname(file).toLowerCase()];
      if (!mimetype) {
        log(`  BỎ QUA (đuôi file lạ)  ${model}#${row.id}  ${ref}`);
        summary.skipped++;
        continue;
      }
      if (!apply) {
        log(`  SẼ CHUYỂN  ${model}#${row.id}  ${ref}`);
        summary.planned++;
        continue;
      }
      let newRef;
      try {
        newRef = await storage.save({ buffer: fs.readFileSync(file), mimetype }, folder, { isPrivate });
      } catch (err) {
        log(`  LỖI UPLOAD  ${model}#${row.id}  ${err.message}`);
        summary.failed++;
        continue;
      }
      try {
        // Chỉ ghi khi giá trị cũ chưa đổi (người dùng có thể vừa đổi ảnh trong lúc script chạy)
        const result = await prisma[model].updateMany({ where: { id: row.id, [field]: ref }, data: { [field]: newRef } });
        if (result.count === 1) {
          log(`  ĐÃ CHUYỂN  ${model}#${row.id}  ${ref} -> ${newRef}`);
          summary.migrated++;
        } else {
          await storage.remove(newRef);
          log(`  BỎ QUA (giá trị vừa bị đổi)  ${model}#${row.id}`);
          summary.skipped++;
        }
      } catch (err) {
        await storage.remove(newRef);
        log(`  LỖI DB  ${model}#${row.id}  ${err.message} (đã xóa file vừa upload)`);
        summary.failed++;
      }
    }
  }
  log(`\nKết quả: ${apply ? `chuyển ${summary.migrated}` : `sẽ chuyển ${summary.planned}`}, thiếu file ${summary.missing}, bỏ qua ${summary.skipped}, lỗi ${summary.failed}`);
  return summary;
}

module.exports = { migrate, TARGETS };

if (require.main === module) {
  require("dotenv").config({ quiet: true });
  const prisma = require("../src/config/database");
  const storage = require("../src/utils/storage");
  migrate({ apply: process.argv.includes("--apply"), prisma, storage })
    .then(async (summary) => {
      await prisma.$disconnect();
      process.exit(summary.failed ? 1 : 0);
    })
    .catch(async (err) => {
      console.error("Lỗi:", err.message);
      await prisma.$disconnect().catch(() => {});
      process.exit(1);
    });
}
