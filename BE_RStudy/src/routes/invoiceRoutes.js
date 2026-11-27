const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const { requirePermission } = require("../middlewares/permissionMiddleware");
const { buildUploader } = require("../middlewares/uploadMiddleware");
const validate = require("../middlewares/validateMiddleware");
const { contentWriteLimiter } = require("../middlewares/rateLimitMiddleware");
const { PERMISSIONS } = require("../constants/permissions");
const controller = require("../controllers/invoiceController");
const { rejectInvoiceSchema, refundRequestSchema, refundNoteSchema, rejectRefundSchema } = require("../validators/invoiceValidator");

// Ảnh minh chứng: JPG/PNG/WEBP, tối đa 5MB, lưu riêng tư, không phục vụ công khai
const uploadProof = buildUploader({
    allowedMimes: { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" },
    maxSizeMB: 5,
    field: "proof",
});

// Duyệt thanh toán cần QUAN_LY_THANH_TOAN; xử lý hoàn tiền cần XU_LY_HOAN_TIEN.
// Xem hóa đơn và ảnh minh chứng: cần một trong hai quyền (admin xử lý hoàn tiền cũng phải đối chiếu minh chứng).
const canHandlePayment = requirePermission(PERMISSIONS.QUAN_LY_THANH_TOAN);
const canHandleRefund = requirePermission(PERMISSIONS.XU_LY_HOAN_TIEN);
const canViewInvoice = requirePermission(PERMISSIONS.QUAN_LY_THANH_TOAN, PERMISSIONS.XU_LY_HOAN_TIEN);
const adminNeedsPermission = (req, res, next) =>
    req.user.role === "ADMINISTRATOR" ? canViewInvoice(req, res, next) : next();

router.use(authenticate);

router.get("/me", authorize("STUDENT"), controller.listMine);
router.get("/refund-requests/me", authorize("STUDENT"), controller.listMyRefundRequests);

router.get("/refund-requests", canHandleRefund, controller.listRefundRequests);
router.patch("/refund-requests/:id/approve", canHandleRefund, validate(refundNoteSchema), controller.approveRefund);
router.patch("/refund-requests/:id/complete", canHandleRefund, validate(refundNoteSchema), controller.completeRefund);
router.patch("/refund-requests/:id/reject", canHandleRefund, validate(rejectRefundSchema), controller.rejectRefund);

router.get("/", canHandlePayment, controller.listAll);
router.patch("/:id/approve", canHandlePayment, controller.approve);
router.patch("/:id/reject", canHandlePayment, validate(rejectInvoiceSchema), controller.reject);

router.post("/:id/proof", authorize("STUDENT"), contentWriteLimiter, uploadProof, controller.uploadProof);
router.post("/:id/refund-request", authorize("STUDENT"), validate(refundRequestSchema), controller.requestRefund);

// Học viên chỉ xem hóa đơn của mình; admin cần một trong hai quyền ở trên
router.get("/:id/proof", authorize("STUDENT", "ADMINISTRATOR"), adminNeedsPermission, controller.getProof);
router.get("/:id", authorize("STUDENT", "ADMINISTRATOR"), adminNeedsPermission, controller.getById);

module.exports = router;