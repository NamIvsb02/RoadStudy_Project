const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');
const {
  idParamSchema,
  createCategorySchema,
  updateCategorySchema,
  changeStatusSchema,
} = require('../validators/categoryValidator');

const adminOnly = [authenticate, authorize('ADMINISTRATOR')];

//ADMIN (đặt TRƯỚC '/:id' để '/manage' không bị coi là id)
router.get('/manage', ...adminOnly, categoryController.getAdminList);
router.get('/manage/:id', ...adminOnly, validate(idParamSchema, 'params'), categoryController.getAdminById);

router.post('/', ...adminOnly, validate(createCategorySchema), categoryController.create);
router.put(
  '/:id',
  ...adminOnly,
  validate(idParamSchema, 'params'),
  validate(updateCategorySchema),
  categoryController.update
);
router.patch(
  '/:id/status',
  ...adminOnly,
  validate(idParamSchema, 'params'),
  validate(changeStatusSchema),
  categoryController.changeStatus
);
router.delete('/:id', ...adminOnly, validate(idParamSchema, 'params'), categoryController.remove);

//PUBLIC
router.get('/', categoryController.getPublicList);
router.get('/:id', validate(idParamSchema, 'params'), categoryController.getPublicById);

module.exports = router;