const db = require("../models");
const ROLES = db.ROLES;
const User = require('../models/user.model');

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  try {
    User.findOne({
      username: req.body.username
    }).exec((err, user) => {
      if (err) {
        res.status(404).send({ message: err });
        return;
      }
      if (user) {
        res.status(404).send({ message: "Failed! Username is already in use!" });
        return;
      }
      // Email
      User.findOne({
        email: req.body.email
      }).then((err, user) => {
        if (err) {
          res.status(404).send({ message: err });
          return;
        }
        if (user) {
          res.status(404).send({ message: "Failed! Email is already in use!" });
          return;
        }
        next();
      });
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

checkRolesExisted = (req, res, next) => {
  try {
    if (req.body.roles) {
      for (let i = 0; i < req.body.roles.length; i++) {
        if (!ROLES.includes(req.body.roles[i])) {
          res.status(404).send({
            message: `Failed! Role ${req.body.roles[i]} does not exist!`
          });
          return;
        }
      }
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

removeRoleFrombody = (req, res, next) => {
  try{
    if (req.body.roles) {
      delete req.body.roles;
    }
    next();
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  removeRoleFrombody
};

module.exports = verifySignUp;