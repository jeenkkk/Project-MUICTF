const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
const blacklist = new Set();
exports.signup = (req, res) => {
  if (!req.body.username || req.body.username === "") {
    res.status(400).send({ message: "Username is required!" });
    return;
  }
  if (!req.body.email) {
    res.status(400).send({ message: "Email is required!" });
    return;
  }
  if (!req.body.password) {
    res.status(400).send({ message: "Password is required!" });
    return;
  }
  // input validation
  if (req.body.username.length < 5) {
    res.status(400).send({ message: "Username must be at least 3 characters long!" });
    return;
  }
  if (req.body.password.length < 6) {
    res.status(400).send({ message: "Password must be at least 6 characters long!" });
    return;
  }
  if (req.body.username === req.body.password) {
    res.status(400).send({ message: "Username and Password must be different!" });
    return;
  }
  if (specialCharacters.test(req.body.username)) {
    res.status(400).send({ message: "Username cannot contain special characters!" });
    return;
  }
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    user.save((err, user) => { // save user to database
      if (err) {
        res.status(404).send({ message: "Fail to Sign Up" }); // if error, send error message
        return;
      }
      if (req.body.roles) {
        Role.find(
          {
            name: { $in: req.body.roles },
          },
          (err, roles) => {
            if (err) {
              res.status(404).send({ message: "Fail to Sign Up" });
              return;
            }
            user.roles = roles.map((role) => role.name); // map roles to user
            user.save((err) => { // save user to database
              if (err) {
                res.status(404).send({ message: "Fail to Sign Up" });
                return;
              }
              res.send({ message: "User was registered successfully!" });
            });
          }
        );
      } else {
        Role.findOne({ name: "Student" }, (err, role) => {
          if (err) {
            res.status(404).send({ message: "Fail to Sign Up" });
            return;
          }
          user.save((err) => {
            if (err) {
              res.status(404).send({ message: "Fail to Sign Up" });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        });
      }
    });
  } catch (err) {
    res.status(404).send({ message: "Fail to Sign Up" });
  }
};

exports.signin = async (req, res) => {
  if (!req.body.username) {
    res.status(404).send({ message: "Username is required!" });
    return;
  }
  if (!req.body.password) {
    res.status(404).send({ message: "Password is required!" });
    return;
  }
  if (specialCharacters.test(req.body.username)) {
    res.status(400).send({ message: "Username cannot contain special characters!" });
    return;
  } else {
    try {
      User.findOne({
        username: req.body.username,
      })
        .exec((err, user) => {
          if (err) {
            res.status(404).send({ message: 'Invalid username or password' });
            return;
          }
          if (!user) {
            return res.status(404).send({ message: "Invalid username or password" });
          }
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );

          if (!passwordIsValid) {
            return res.status(401).send({ message: "Invalid username or password" });
          }
          // Store user ID in the session
          req.session.userId = user._id;
          const token = jwt.sign({ id: user.id },
            config.secret,
            {
              algorithm: 'HS256',
              allowInsecureKeySizes: true,
              expiresIn: 10800, // 3 hours
            });
          res.cookie('token', token, { httpOnly: true, maxAge: 10800 }); // set cookie
          res.status(200).send({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            token: token,
          });

        });
    } catch (err) {
      res.status(404).send({ message: 'Invalid username or password' });
    }

  }
};

exports.signout = async (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).send({ message: "An error occurred while signing out." });
      }
      const token = req.body.token; // Token to revoke
      blacklist.add(token); // Assuming 'blacklist' is a set or similar structure to store revoked tokens
      res.clearCookie('token'); // Clear cookie
      return res.status(200).send({ message: "You've been signed out!" });
    });
  } catch (err) {
    console.error("Error signing out:", err);
    return res.status(500).send({ message: "An error occurred while signing out. Please try again later." });
  }
};
