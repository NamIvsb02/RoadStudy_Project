const router = require('express').Router();
const courseController = require('../controllers/courseController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  idParamSchema,
  createCourseSchema,
  updateCourseSchema,
  changeStatusSchema,
} = require('../validators/courseValidator');

const teacherOnly = [authenticate, authorize('TEACHER')];
const adminOnly = [authenticate, authorize('ADMINISTRATOR')];


//GIÁO VIÊN
router.post('/', ...teacherOnly, validate(createCourseSchema), courseController.create);
router.get('/mine', ...teacherOnly, courseController.getMyList);
router.get('/mine/:id', ...teacherOnly, validate(idParamSchema, 'params'), courseController.getMyById);
router.put(
  '/:id',
  ...teacherOnly,
  validate(idParamSchema, 'params'),
  validate(updateCourseSchema),
  courseController.update
);
router.post('/:id/submit', ...teacherOnly, validate(idParamSchema, 'params'), courseController.submit);

//QUẢN TRỊ VIÊN
router.get('/manage', ...adminOnly, courseController.getAdminList);
router.get('/manage/:id', ...adminOnly, validate(idParamSchema, 'params'), courseController.getAdminById);
router.post('/:id/approve', ...adminOnly, validate(idParamSchema, 'params'), courseController.approve);
router.post('/:id/reject', ...adminOnly, validate(idParamSchema, 'params'), courseController.reject);
router.patch(
  '/:id/status',
  ...adminOnly,
  validate(idParamSchema, 'params'),
  validate(changeStatusSchema),
  courseController.changeStatus
);

router.get('/', courseController.getPublicList);
router.get('/:id', validate(idParamSchema, 'params'), courseController.getPublicById);

module.exports = router;