const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const controller = require("../controllers/couponController");
const {
    createCouponSchema,
    updateCouponSchema,
    changeStatusSchema,
    validateCouponSchema,
} = require("../validators/couponValidator");

router.use(authenticate);

// Học viên (và admin để test) kiểm tra mã trước khi thanh toán
router.post("/validate", authorize("STUDENT", "ADMINISTRATOR"), validate(validateCouponSchema), controller.validate);

// Quản lý mã giảm giá: chỉ quản trị viên
router.use(authorize("ADMINISTRATOR"));
router.get("/", controller.list);
router.get("/:id", controller.getById);
router.post("/", validate(createCouponSchema), controller.create);
router.put("/:id", validate(updateCouponSchema), controller.update);
router.patch("/:id/status", validate(changeStatusSchema), controller.changeStatus);
router.delete("/:id", controller.remove);

module.exports = router;
