const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const AppError = require("../utils/AppError");

const UPLOAD_ROOT = path.join(__dirname, "../../uploads");

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
    upload(req, res, (err) => {
      if (!err) return next();
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
};
