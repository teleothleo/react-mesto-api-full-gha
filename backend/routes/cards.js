const router = require('express').Router();

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCard } = require('../middleware/validation-headers');
const { validateCardById } = require('../middleware/validation-url');

router.get('/', getCards);
router.post('/', validateCreateCard, createCard);
router.delete('/:cardId', validateCardById, deleteCard);
router.put('/:cardId/likes', validateCardById, likeCard);
router.delete('/:cardId/likes', validateCardById, dislikeCard);

module.exports = router;
