const mongoose = require("mongoose");

const Course = mongoose.model(
    "course",
    new mongoose.Schema({
        Name: String,
        Question: [
            {
                type: String
            }
        ],
    })
);

module.exports = Course;