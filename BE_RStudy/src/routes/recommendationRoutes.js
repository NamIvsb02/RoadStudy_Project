const router = require("express").Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const controller = require("../controllers/recommendationController");

router.get("/me", authenticate, authorize("STUDENT"), controller.getMine);

module.exports = router;
