const router = require("express").Router();
const resourceController = require("../controllers/resourceController");
const resourceService = require("../services/resourceService");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { uploadResource } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { idParamSchema, createResourceSchema } = require("../validators/resourceValidator");

// Nếu validate body fail thì xóa file multer đã lưu
const cleanupOnError = (mw) => (req, res, next) =>
  mw(req, res, async (err) => {
    if (err && req.file) await resourceService.removeFile(req.file.filename);
    next(err);
  });

// PUBLIC
router.get("/", resourceController.getList);
router.get("/:id", validate(idParamSchema, "params"), resourceController.getById);

// TEACHER
router.post("/", authenticate, authorize("TEACHER"), uploadResource, cleanupOnError(validate(createResourceSchema)), resourceController.create);

// TEACHER (của mình) + ADMINISTRATOR (tất cả)
router.delete("/:id", authenticate, authorize("TEACHER", "ADMINISTRATOR"), validate(idParamSchema, "params"), resourceController.remove);

module.exports = router;
