const router = require('express').Router();

const {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');
const { validateUpdateUser, validateUpdateAvatar } = require('../middleware/validation-headers');
const { validateGetUserById } = require('../middleware/validation-url');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', validateGetUserById, getUserById);
router.patch('/me', validateUpdateUser, updateUser);
router.patch('/me/avatar', validateUpdateAvatar, updateUserAvatar);

module.exports = router;
