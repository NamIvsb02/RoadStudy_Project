const router = require("express").Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { requireAdmin, requireLeader } = require("../middlewares/permissionMiddleware");
const controller = require("../controllers/adminController");

router.use(authenticate);

router.get("/me", requireAdmin, controller.getMe);

router.use(requireLeader);

router.get("/system-functions", controller.listSystemFunctions);
router.get("/administrators", controller.listAdministrators);
router.post("/administrators", controller.createAdministrator);
router.get("/administrators/:id", controller.getAdministrator);
router.patch("/administrators/:id/status", controller.setAdministratorStatus);
router.put("/administrators/:id/permissions", controller.setAdministratorPermissions);

module.exports = router;
