const router = require('express').Router();
const commentController = require('../controllers/commentController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  courseIdParamSchema,
  idParamSchema,
  replyIdParamSchema,
  contentBodySchema,
} = require('../validators/commentValidator');


const writers = [authenticate, authorize('STUDENT', 'TEACHER')];

// ---------- theo khóa học ----------
router.get('/course/:courseId', authenticate, validate(courseIdParamSchema, 'params'), commentController.listByCourse);
router.post(
  '/course/:courseId',
  ...writers,
  validate(courseIdParamSchema, 'params'),
  validate(contentBodySchema),
  commentController.create
);


router.put(
  '/replies/:replyId',
  ...writers,
  validate(replyIdParamSchema, 'params'),
  validate(contentBodySchema),
  commentController.updateReply
);
router.delete('/replies/:replyId', ...writers, validate(replyIdParamSchema, 'params'), commentController.removeReply);

router.post(
  '/:id/replies',
  ...writers,
  validate(idParamSchema, 'params'),
  validate(contentBodySchema),
  commentController.reply
);
router.put(
  '/:id',
  ...writers,
  validate(idParamSchema, 'params'),
  validate(contentBodySchema),
  commentController.update
);
router.delete('/:id', ...writers, validate(idParamSchema, 'params'), commentController.remove);

module.exports = router;