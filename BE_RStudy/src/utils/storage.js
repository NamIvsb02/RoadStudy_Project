// Lưu trữ file upload. STORAGE_DRIVER=local (mặc định, ghi vào BE_RStudy/uploads) hoặc cloudinary.
//
// Giá trị lưu trong DB (tham chiếu file):
//   local, công khai : /uploads/<folder>/<tên file>
//   local, riêng tư  : <folder>/<tên file>           (minh chứng thanh toán)
//   cloudinary       : URL https://res.cloudinary.com/... (riêng tư dùng type "authenticated", URL không mở được nếu không ký)
//
// Thứ tự xử lý ở nơi gọi: LƯU file mới -> cập nhật DB -> XÓA file cũ.
// Nhờ vậy sự cố ở giữa chỉ để lại file mồ côi (xóa bằng scripts/cleanup-orphan-files.js), không bao giờ làm DB trỏ vào file không có.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const AppError = require("./AppError");

const UPLOAD_ROOT = path.join(__dirname, "../../uploads");
const UPLOAD_TIMEOUT_MS = 20000;
const EXTENSIONS = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};
const RAW_FOLDERS = new Set(["resources"]); // tài liệu pdf/docx: Cloudinary resource_type "raw"
// Có thể có đoạn chữ ký s--xxxxxxxx--/ (URL đã ký) trước phiên bản vN/
const CLOUDINARY_URL = /^https:\/\/res\.cloudinary\.com\/([^/]+)\/(image|raw|video)\/(upload|authenticated)\/(?:s--[\w-]+--\/)?(?:v(\d+)\/)?(.+)$/;
const SIGNATURE_SEGMENT = /\/s--[\w-]+--\//;

const driver = () => (process.env.STORAGE_DRIVER === "cloudinary" ? "cloudinary" : "local");
const isUrl = (ref) => /^https?:\/\//i.test(ref);

// Thư mục gốc trên Cloudinary, tách theo môi trường để dữ liệu test không lẫn dữ liệu thật
const baseFolder = () => process.env.CLOUDINARY_FOLDER || `roadstudy/${process.env.NODE_ENV === "production" ? "prod" : "dev"}`;

if (driver() === "cloudinary") {
  const missing = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"].filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`STORAGE_DRIVER=cloudinary nhưng thiếu biến môi trường: ${missing.join(", ")}`);
}

let cloudinaryClient = null;
const getCloudinary = () => {
  if (!cloudinaryClient) {
    cloudinaryClient = require("cloudinary").v2;
    cloudinaryClient.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  return cloudinaryClient;
};

// Tách thông tin từ URL Cloudinary để xóa hoặc ký lại. Trả null nếu không phải URL Cloudinary.
const parseCloudinaryUrl = (url) => {
  const match = CLOUDINARY_URL.exec(url || "");
  if (!match) return null;
  const [, cloudName, resourceType, type, version, rest] = match;
  const decoded = decodeURIComponent(rest);
  if (resourceType === "raw") return { cloudName, resourceType, type, version, publicId: decoded, format: null };
  const dot = decoded.lastIndexOf(".");
  return {
    cloudName,
    resourceType,
    type,
    version,
    publicId: dot > 0 ? decoded.slice(0, dot) : decoded,
    format: dot > 0 ? decoded.slice(dot + 1) : null,
  };
};

// Chỉ thao tác với file của chính mình: đúng cloud và nằm trong thư mục gốc của môi trường hiện tại
const ownCloudinaryAsset = (ref) => {
  const parsed = parseCloudinaryUrl(ref);
  if (!parsed || parsed.cloudName !== process.env.CLOUDINARY_CLOUD_NAME) return null;
  if (!parsed.publicId.startsWith(`${baseFolder()}/`)) return null;
  return parsed;
};

const saveLocal = async (file, folder, name, ext, isPrivate) => {
  const dir = path.join(UPLOAD_ROOT, folder);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(path.join(dir, `${name}${ext}`), file.buffer);
  return isPrivate ? `${folder}/${name}${ext}` : `/uploads/${folder}/${name}${ext}`;
};

const saveCloudinary = async (file, folder, name, ext, isPrivate) => {
  const raw = RAW_FOLDERS.has(folder);
  const options = {
    public_id: `${baseFolder()}/${folder}/${name}${raw ? ext : ""}`,
    resource_type: raw ? "raw" : "image",
    type: isPrivate ? "authenticated" : "upload",
    overwrite: false,
    timeout: UPLOAD_TIMEOUT_MS,
  };
  const result = await new Promise((resolve, reject) => {
    getCloudinary().uploader.upload_stream(options, (error, response) => (error ? reject(error) : resolve(response))).end(file.buffer);
  });
  // File riêng tư: Cloudinary trả secure_url ĐÃ KÈM chữ ký không hết hạn. Bỏ chữ ký trước khi lưu DB,
  // để chỉ server (có API secret) mới tạo được link xem; lộ giá trị trong DB cũng không mở được file.
  return isPrivate ? result.secure_url.replace(SIGNATURE_SEGMENT, "/") : result.secure_url;
};

// file: đối tượng multer (memoryStorage) có buffer và mimetype. Trả về tham chiếu để lưu vào DB.
const save = async (file, folder, { isPrivate = false } = {}) => {
  const ext = EXTENSIONS[file.mimetype];
  if (!ext || !file.buffer) throw new AppError("Tệp tải lên không hợp lệ", 400);
  const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}`;
  try {
    return driver() === "cloudinary" ? await saveCloudinary(file, folder, name, ext, isPrivate) : await saveLocal(file, folder, name, ext, isPrivate);
  } catch (err) {
    console.error("Lưu tệp thất bại:", err?.message || err);
    throw new AppError("Không tải được tệp lên, vui lòng thử lại sau", 503);
  }
};

// Xóa file. Không bao giờ ném lỗi: file không còn hoặc dịch vụ lỗi chỉ để lại file mồ côi, không làm hỏng nghiệp vụ chính.
const remove = async (ref) => {
  if (!ref) return;
  try {
    if (isUrl(ref)) {
      if (driver() !== "cloudinary") return;
      const asset = ownCloudinaryAsset(ref);
      if (!asset) return;
      await getCloudinary().uploader.destroy(asset.publicId, { resource_type: asset.resourceType, type: asset.type, invalidate: true });
      return;
    }
    const file = path.resolve(UPLOAD_ROOT, ref.replace(/^\/?uploads\//, ""));
    if (!file.startsWith(UPLOAD_ROOT + path.sep)) return; // chặn đường dẫn thoát khỏi thư mục uploads
    await fs.promises.unlink(file);
  } catch (err) {
    if (err?.code !== "ENOENT") console.error("Xóa tệp thất bại:", err?.message || err);
  }
};

// Đọc file riêng tư (minh chứng thanh toán). local: trả { file } để sendFile. cloudinary: tải qua URL có chữ ký, trả { buffer, contentType }.
const readPrivate = async (ref, folder = "proofs") => {
  if (isUrl(ref)) {
    const asset = driver() === "cloudinary" ? ownCloudinaryAsset(ref) : null;
    if (!asset) throw new AppError("Tệp không còn tồn tại", 404);
    const signedUrl = getCloudinary().url(asset.publicId, {
      resource_type: asset.resourceType,
      type: asset.type,
      version: asset.version,
      format: asset.format || undefined,
      sign_url: true,
      secure: true,
    });
    let response;
    try {
      response = await fetch(signedUrl, { signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS) });
    } catch (err) {
      console.error("Tải tệp riêng tư thất bại:", err?.message || err);
      throw new AppError("Không tải được tệp, vui lòng thử lại sau", 503);
    }
    if (response.status === 404) throw new AppError("Tệp không còn tồn tại", 404);
    if (!response.ok) throw new AppError("Không tải được tệp, vui lòng thử lại sau", 503);
    return { buffer: Buffer.from(await response.arrayBuffer()), contentType: response.headers.get("content-type") || "application/octet-stream" };
  }
  const dir = path.join(UPLOAD_ROOT, folder);
  const file = path.resolve(UPLOAD_ROOT, ref);
  if (!file.startsWith(dir + path.sep) || !fs.existsSync(file)) throw new AppError("Tệp không còn tồn tại", 404);
  return { file };
};

module.exports = { save, remove, readPrivate, parseCloudinaryUrl, ownCloudinaryAsset, baseFolder, driver, isUrl, EXTENSIONS, UPLOAD_ROOT };
