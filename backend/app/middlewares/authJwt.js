
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
var jwt = require("jsonwebtoken");
verifyToken = async (req, res, next) => {
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
    if (userid != null) {
      next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
      res.status(401).json({ message: 'Unauthorized' }); // User is not authenticated
    }
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

isAdmin = async (req, res, next) => {
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
    const checkrole = userid.roles;
    if (checkrole == "Admin") {
      next(); // User is authenticated, proceed to the next middleware or route handler
    }
    else {
      res.status(403).send({ message: "No Permission!" });
    }
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

isteacher = async (req, res, next) => {
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
    const checkrole = userid.roles;
    if (checkrole == "Teacher") {
      next(); // User is authenticated, proceed to the next middleware or route handler
    }
    else {
      res.status(403).send({ message: "No Permission!" });
    }
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
const authJwt = {
  verifyToken,
  isAdmin,
  isteacher,
};
module.exports = authJwt;
