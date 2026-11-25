const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const AppError = require("../utils/AppError");

const UPLOAD_ROOT = path.join(__dirname, "../../uploads");

// Chữ ký (magic bytes) đầu file theo mimetype: mimetype do client gửi nên không đáng tin, phải đối chiếu nội dung thật
const SIGNATURES = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP",
  "application/pdf": (b) => b.subarray(0, 4).toString("latin1") === "%PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
};

const hasValidSignature = async (file) => {
  const matches = SIGNATURES[file.mimetype];
  if (!matches) return false;
  const handle = await fs.promises.open(file.path, "r");
  try {
    const buffer = Buffer.alloc(12);
    const { bytesRead } = await handle.read(buffer, 0, 12, 0);
    return matches(buffer.subarray(0, bytesRead));
  } finally {
    await handle.close();
  }
};

// Dùng lại cho Resource (folder 'resources') và minh chứng thanh toán (folder 'proofs')
const buildUploader = ({ folder, allowedMimes, maxSizeMB, field }) => {
  const dir = path.join(UPLOAD_ROOT, folder);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = allowedMimes[file.mimetype];
      cb(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`);
    },
  });

  const upload = multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
      if (!allowedMimes[file.mimetype]) {
        return cb(new AppError(`Chỉ chấp nhận: ${Object.values(allowedMimes).join(", ")}`, 400));
      }
      cb(null, true);
    },
  }).single(field);

  return (req, res, next) => {
    upload(req, res, async (err) => {
      if (!err) {
        if (!req.file) return next();
        try {
          if (await hasValidSignature(req.file)) return next();
          await fs.promises.unlink(req.file.path).catch(() => {});
          return next(new AppError("Nội dung tệp không đúng định dạng", 400));
        } catch (checkError) {
          return next(checkError);
        }
      }
      if (err.code === "LIMIT_FILE_SIZE") return next(new AppError(`Tệp tối đa ${maxSizeMB}MB`, 400));
      if (err instanceof multer.MulterError) return next(new AppError("Tệp tải lên không hợp lệ", 400));
      return next(err);
    });
  };
};

const IMAGE_MIMES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const DOC_MIMES = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

module.exports = {
  buildUploader,
  uploadAvatar: buildUploader({ folder: "avatars", allowedMimes: IMAGE_MIMES, maxSizeMB: 2, field: "avatar" }),
  uploadResource: buildUploader({ folder: "resources", allowedMimes: DOC_MIMES, maxSizeMB: 10, field: "file" }),
  uploadCover: buildUploader({ folder: "covers", allowedMimes: IMAGE_MIMES, maxSizeMB: 3, field: "cover" }),
};
