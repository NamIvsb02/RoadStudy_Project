const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateMiddleware");
const controller = require("../controllers/enrollmentController");
const { createEnrollmentSchema } = require("../validators/enrollmentValidator");

router.use(authenticate, authorize("STUDENT"));

router.post("/", validate(createEnrollmentSchema), controller.create);
router.get("/me", controller.listMine);
router.get("/:id", controller.getMine);
router.post("/:id/cancel", controller.cancel);

module.exports = router;