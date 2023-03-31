const Card = require('../models/card');
const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorNotFound = require('../utils/ErrorNotFound');
const ErrorForbidden = require('../utils/ErrorForbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      // console.log('cards contoler getCards: ', cards);
      res.send(cards);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => {
      console.log('createCard: ', name, link);
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Incorrect data passed'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => Card.findById(req.params.cardId)
  .then((card) => {
    console.log('deleteCard: ', req.headers, req.params);
    if (!card) {
      next(new ErrorNotFound('Card not found'));
      return;
    }
    if (card.owner.toString() !== req.user._id) {
      next(new ErrorForbidden('You may only remove your own cards'));
      return;
    }
    card
      .remove()
      .then(() => res.send({ message: 'Card was deleted successfully' }))
      .catch(next);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new ErrorBadRequest('Incorrect id passed'));
      return;
    }
    next(err);
  });

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Card not found'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Incorrect id passed'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new ErrorNotFound('Card not found'));
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Incorrect id passed'));
        return;
      }
      next(err);
    });
};
