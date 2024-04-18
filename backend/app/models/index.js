const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

// add models to db
db.user = require("./user.model");
db.role = require("./role.model");
db.challenge = require("./challenge.model"); 
db.topic = require("./topic.model");
db.course = require("./course.model");
db.file = require("./file.model");

db.ROLES = ["user", "admin", "teacher"];

module.exports = db;