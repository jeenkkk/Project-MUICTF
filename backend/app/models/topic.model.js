const mongoose = require("mongoose");

const Topic = mongoose.model(
  "topic",
  new mongoose.Schema({
    Name: String,
    Question: [
      {
        type: String
      }
    ],
  })
);



module.exports = Topic;
