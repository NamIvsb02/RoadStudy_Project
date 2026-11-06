const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { buildUploader } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const controller = require("../controllers/invoiceController");
const { rejectInvoiceSchema, refundRequestSchema, refundNoteSchema, rejectRefundSchema } = require("../validators/invoiceValidator");

// Ảnh minh chứng: JPG/PNG/WEBP, tối đa 5MB, lưu ở uploads/proofs (không mở công khai)
const uploadProof = buildUploader({
    folder: "proofs",
    allowedMimes: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
    maxSizeMB: 5,
    field: "proof",
});

// Quyền duyệt thanh toán: tạm dùng XU_LY_HOAN_TIEN. Nếu nhóm thêm quyền riêng (vd QUAN_LY_THANH_TOAN) thì chỉ cần đổi ở đây.
const canHandlePayment = requirePermission(PERMISSIONS.XU_LY_HOAN_TIEN);
const canHandleRefund = requirePermission(PERMISSIONS.XU_LY_HOAN_TIEN);
const adminNeedsPermission = (req, res, next) =>
    req.user.role === "ADMINISTRATOR" ? canHandlePayment(req, res, next) : next();

router.use(authenticate);

// ----- Học viên -----
router.get("/me", authorize("STUDENT"), controller.listMine);
router.get("/refund-requests/me", authorize("STUDENT"), controller.listMyRefundRequests);

// ----- Admin: yêu cầu hoàn tiền -----
router.get("/refund-requests", canHandleRefund, controller.listRefundRequests);
router.patch("/refund-requests/:id/approve", canHandleRefund, validate(refundNoteSchema), controller.approveRefund);
router.patch("/refund-requests/:id/complete", canHandleRefund, validate(refundNoteSchema), controller.completeRefund);
router.patch("/refund-requests/:id/reject", canHandleRefund, validate(rejectRefundSchema), controller.rejectRefund);

// ----- Admin: duyệt thanh toán -----
router.get("/", canHandlePayment, controller.listAll);
router.patch("/:id/approve", canHandlePayment, controller.approve);
router.patch("/:id/reject", canHandlePayment, validate(rejectInvoiceSchema), controller.reject);

// ----- Học viên: gửi minh chứng / yêu cầu hoàn tiền -----
router.post("/:id/proof", authorize("STUDENT"), uploadProof, controller.uploadProof);
router.post("/:id/refund-request", authorize("STUDENT"), validate(refundRequestSchema), controller.requestRefund);

// ----- Xem hóa đơn và minh chứng: chủ hóa đơn hoặc admin có quyền -----
router.get("/:id/proof", authorize("STUDENT", "ADMINISTRATOR"), adminNeedsPermission, controller.getProof);
router.get("/:id", authorize("STUDENT", "ADMINISTRATOR"), adminNeedsPermission, controller.getById);

module.exports = router;