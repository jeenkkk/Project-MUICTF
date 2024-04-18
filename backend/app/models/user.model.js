const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true }, //unique is used to prevent duplicate email
    password: { type: String, required: true, },
    roles: { type: String, required: false, default: "Student" },
    Question: [
      {
        type: String
      }
    ],
    VulnQuestion: [
      {
        type: String
      }
    ],
    VulnFlag: [
      {
        type: String
      }
    ],
    score: {
      type: Number,
      default: 0
    },
    vulnscore: {
      type: Number,
      default: 0
    },
    rankscore: {
      type: Number,
      default: 1500
    },
    matches: {
      type: Number,
      default: 0
    },
    wins: {
      type: Number,
      default: 0
    },
    availability: {
      type: String,
      //enum: ["true", "false", "match"],
      default: "true"
    },
  })
);



module.exports = User;
