const multer = require("multer");
const AppError = require("../utils/AppError");

// Chữ ký (magic bytes) đầu file theo mimetype: mimetype do client gửi nên không đáng tin, phải đối chiếu nội dung thật
const SIGNATURES = {
  "image/jpeg": (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (b) => b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP",
  "application/pdf": (b) => b.subarray(0, 4).toString("latin1") === "%PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": (b) => b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04,
};

const hasValidSignature = (file) => {
  const matches = SIGNATURES[file.mimetype];
  return Boolean(matches) && matches(file.buffer.subarray(0, 12));
};

// Chỉ nhận và kiểm tra file, giữ trong RAM (req.file.buffer). Việc lưu lên đĩa hoặc Cloudinary do service gọi utils/storage
// sau khi đã kiểm tra quyền và dữ liệu, để request lỗi không để lại file thừa. Dùng cho avatar, ảnh bìa, tài liệu, minh chứng.
const buildUploader = ({ allowedMimes, maxSizeMB, field }) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024, files: 1 },
    fileFilter: (req, file, cb) => {
      if (!allowedMimes[file.mimetype]) {
        return cb(new AppError(`Chỉ chấp nhận: ${Object.values(allowedMimes).join(", ")}`, 400));
      }
      cb(null, true);
    },
  }).single(field);

  const middleware = (req, res, next) => {
    upload(req, res, (err) => {
      if (!err) {
        if (!req.file || hasValidSignature(req.file)) return next();
        return next(new AppError("Nội dung tệp không đúng định dạng", 400));
      }
      if (err.code === "LIMIT_FILE_SIZE") return next(new AppError(`Tệp tối đa ${maxSizeMB}MB`, 400));
      if (err instanceof multer.MulterError) return next(new AppError("Tệp tải lên không hợp lệ", 400));
      return next(err);
    });
  };
  middleware.apiDoc = { upload: { field, maxSizeMB, types: Object.values(allowedMimes) } }; // cho Swagger
  return middleware;
};

const IMAGE_MIMES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };
const DOC_MIMES = {
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
};

module.exports = {
  buildUploader,
  uploadAvatar: buildUploader({ allowedMimes: IMAGE_MIMES, maxSizeMB: 2, field: "avatar" }),
  uploadResource: buildUploader({ allowedMimes: DOC_MIMES, maxSizeMB: 10, field: "file" }),
  uploadCover: buildUploader({ allowedMimes: IMAGE_MIMES, maxSizeMB: 3, field: "cover" }),
};
