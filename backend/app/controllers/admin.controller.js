const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var bcrypt = require("bcryptjs");

exports.deleteuser = (req, res) => {
  //delete user
  //console.log(req);
  User.findOneAndDelete({ username: req.params.user }, function (err, user) {
    if (err) {
      return res.status(500).send({ message: "Error deleting user" });
    }
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    return res.status(200).send({ message: "User deleted successfully" });
  });
};

exports.alluser = (req, res) => {
  //get all users
  try {
    User.find({}).exec((err, users) => {
      if (err) {
        res.status(404).send({ message: err });
        return;
      }
      res.status(200).send(users);
    });
  } catch (err) {
    res.status(404).send({ message: "Fail to get all users" });
  }
};

exports.updateuser = (req, res) => {
  //update 1 user
  console.log(req.params.user);
  console.log(req.body);
  try {
    User.findOne({
      username: req.params.user,
    }).exec((err, user) => {
      // execute
      if (err) {
        res.status(404).send({ message: "Fail to update user" });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      if (req.body.email) {
        user.email = req.body.email;
      }
      if (req.body.roles) {
        user.roles = req.body.roles;
      }
      user.save();
      return res.status(200).send({ message: req.params.user + " updated." });
    });
  } catch (err) {
    res.status(404).send({ message: "Fail to update user" });
  }
};

exports.updatemultipleuser = (req, res) => {
  //update multiple user
  try {
    const newpassword = req.body.password;
    const newemail = req.body.email;
    const newroles = req.body.roles;
    const username = req.params.user;

    User.findOne({
      username: username,
    }).exec((err, user) => {
      // execute
      if (err) {
        res.status(400).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(400).send({ message: "User Not found." });
      }
      if (newemail !== "") {
        user.email = newemail;
      }
      if (newroles !== "") {
        if (
          newroles !== "Admin" ||
          newroles !== "Teacher" ||
          newroles !== "Student"
        ) {
          res.status(400).send({ message: "Roles not valid" });
          return;
        }
        user.roles = newroles;
      }
      if (newpassword !== "") {
        user.password = bcrypt.hashSync(newpassword, 8);
      }
      user.save((err) => {
        if (err) {
          res.status(400).send({ message: err });
          return;
        }
      });

      res.send({ message: "User was updated successfully!" });
    });
  } catch (err) {
    res.status(400).send({ message: "Fail to update user" });
  }
};
