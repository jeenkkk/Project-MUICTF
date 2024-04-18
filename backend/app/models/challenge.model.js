const mongoose = require("mongoose");

const Challenge = mongoose.model(
  "Challenge",
  new mongoose.Schema({
    Name: String,
    Author: String,
    Series: String,
    Size: String,
    Difficulty: String,
    Download_Link: String,
    Description: String,
    Flag: [
      { 
        type: String 
      }
    ],
    Solution: String,

  })
);



module.exports = Challenge;
