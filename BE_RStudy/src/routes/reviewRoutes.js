const router = require('express').Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  courseIdParamSchema,
  idParamSchema,
  responseIdParamSchema,
  createReviewSchema,
  updateReviewSchema,
  responseBodySchema,
} = require('../validators/reviewValidator');

const studentOnly = [authenticate, authorize('STUDENT')];
const teacherOnly = [authenticate, authorize('TEACHER')];

router.get('/course/:courseId', validate(courseIdParamSchema, 'params'), reviewController.listByCourse);
router.get('/course/:courseId/mine', ...studentOnly, validate(courseIdParamSchema, 'params'), reviewController.getMine);
router.post(
  '/course/:courseId',
  ...studentOnly,
  validate(courseIdParamSchema, 'params'),
  validate(createReviewSchema),
  reviewController.create
);

//câu trả lời của giáo viên
router.put(
  '/responses/:responseId',
  ...teacherOnly,
  validate(responseIdParamSchema, 'params'),
  validate(responseBodySchema),
  reviewController.updateResponse
);
router.delete(
  '/responses/:responseId',
  ...teacherOnly,
  validate(responseIdParamSchema, 'params'),
  reviewController.removeResponse
);

//theo đánh giá
router.post(
  '/:id/responses',
  ...teacherOnly,
  validate(idParamSchema, 'params'),
  validate(responseBodySchema),
  reviewController.respond
);
router.put(
  '/:id',
  ...studentOnly,
  validate(idParamSchema, 'params'),
  validate(updateReviewSchema),
  reviewController.update
);

module.exports = router;