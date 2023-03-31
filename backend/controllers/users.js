require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const ErrorBadRequest = require('../utils/ErrorBadRequest');
const ErrorNotFound = require('../utils/ErrorNotFound');
const ErrorConflict = require('../utils/ErrorConflict');
const ErrorUnauthorized = require('../utils/ErrorUnauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  console.log('users.js', req.body);
  return User.findOne({ email })
    .select('+password')
    .then(async (user) => {
      if (!user) {
        next(new ErrorUnauthorized('Either email or password is/are wrong'));
        return;
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        next(new ErrorUnauthorized('Either email or password is/are wrong'));
        return;
      }
      console.log('jwtSecret: ', NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ token, user });
    })
    .catch(next);
};

module.exports.getMe = (req, res, next) => {
  console.log('getMe: ', req.user);
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('User not found'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorBadRequest('Incorrect id passed'));
        return;
      }
      next(err);
    });
};

module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Incorrect data passed'));
        return;
      }
      if (err.code === 11000) {
        next(new ErrorConflict('User with the same email alrealy exists'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('Wrong user ID'));
        return;
      }
      console.log('user.js updateUser: ', user);
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Wrong keys or not all fiels are filled out'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new ErrorNotFound('User not found'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ErrorBadRequest('Wrong keys or not all fields are filled out'));
      } else {
        next(err);
      }
    });
};
