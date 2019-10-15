const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  // const { username, password } = req.headers;

  if (req.session && req.session.username) {
    next();
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
