const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Topic = db.topic;
const Course = db.course;
const Challenge = db.challenge;
exports.getinfo = async (req, res) => {
  //res.status(200).send("User Content.");
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      // If Authorization header is missing, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    // Extract the token part from the Authorization header
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    res.status(200).send(
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        question: user.Question,
        AssignmentScore: user.score,
        VulnhubScore: user.vulnscore,
        RankScore: user.rankscore,
        Availability: user.availability,
        vulnQuestion: user.VulnQuestion,
        vulnFlag: user.VulnFlag,
      }
    );
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

exports.updateinfo = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      // If Authorization header is missing, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    // Extract the token part from the Authorization header
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.secret);
    const userid = await User.findById(decoded.id);
    if (!userid) {
      return res.status(404).send({ message: "User Not found." });
    }
    User.findById(userid)
      .exec((err, user) => {
        if (err) {
          res.status(404).send({ message: err });
          return;
        }
        if ((req.newPassword && req.newEmail == "") || req.password == "") {
          res.status(404).send({ message: "Password is required." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        } else {
          if (req.body.newPassword == "") {
            User.updateOne({ _id: userid }, {
              email
                : req.body.newEmail
            }, function (err) {

              if (err) return res.status(404).send(handleError(err));
              else {
                return res.status(200).send({ message: "Email updated." });
              }
            });
          }
          else if (req.body.newEmail == "") {
            User.updateOne({ _id: userid }, { password: bcrypt.hashSync(req.body.newPassword, 8) }, function (err) {
              if (err) return res.status(404).send(handleError(err));
              else {
                return res.status(200).send({ message: "Password updated." });
              }
            });
          }
          else {
            User.updateOne({ _id: userid }, { email: req.body.newEmail, password: bcrypt.hashSync(req.body.newPassword, 8) }, function (err) {
              if (err) return res.status(404).send(handleError(err));
              else {
                return res.status(200).send({ message: "Password and Email updated." });
              }
            });
          }
        }
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

exports.deleteuser = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      // If Authorization header is missing, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    // Extract the token part from the Authorization header
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    User.findById(userid)
      .exec((err, user) => {
        if (err) {
          res.status(404).send({ message: err });
          return;
        }
        if (req.password == "") {
          res.status(404).send({ message: "Password is required." });
        }
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({ message: "Invalid Password!" });
        }
        else {
          User.deleteOne({ _id: userid }, function (err) {
            if (err) return res.status(404).send(handleError(err));
            else return res.status(200).send({ message: "User deleted." });
          });
        }
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}

exports.progression = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      // If Authorization header is missing, send a 401 Unauthorized response
      return res.status(401).json({ error: 'Authorization header missing' });
    }
    // Extract the token part from the Authorization header
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }
    User.findById(user)
      .exec((err, user) => {
        if (err) {
          res.status(404).send({ message: err });
          return;
        }
        Topic.find({}).exec((err, topic) => {
          if (err) {
            res.status(404).send({ message: err });
            return;
          }
          Course.find({}).exec((err, course) => {
            if (err) {
              res.status(404).send({ message: err });
              return;
            }
            Challenge.find({}).exec((err, challenge) => {
              if (err) {
                res.status(404).send({ message: err });
                return;
              }
              const topicsdata = topic.map((topic) => ({
                name: topic.Name,
                completed: user.Question.filter(userQuestion => topic.Question.includes(userQuestion)).length,
                total: topic.Question.length
              }));
              const coursesdata = course.map(course => {
                let completed = user.Question.filter(userQuestion => course.Question.includes(userQuestion)).length;
                let total = course.Question.length;
                if (course.Name === "Vulnhub") {
                  completed = user.VulnQuestion.filter(userQuestion => course.Question.includes(userQuestion)).length;
                }
                return {
                  name: course.Name,
                  completed: completed,
                  total: total
                };
              });
              res.status(200).send(
                {
                  topics: topicsdata,
                  courses: coursesdata,
                }
              );
            });
          });
        });
      });
  } catch (err) {
    res.status(500).send({ message: err });
  }
}
