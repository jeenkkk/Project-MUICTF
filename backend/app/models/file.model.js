const mongoose = require("mongoose");

const File = mongoose.model(
    "File",
    new mongoose.Schema({
        problemname: { type: String, required: true },
        topic: { type: String, required: true },
        description: { type: String, required: false },
        score: { type: Number, required: false ,default:0},
        answer: { type: String, required: true },
        filename: { type: String, required: false, default: "No file"},
        path: { type: String, required: false, default: "No file"},
        size: { type: String, required: false, default: "No file"},
        feedback: [
            {
                type: String, required: false
            }
        ],
        userfeedback: [
            {
                type: String, required: false
            }
        ],
        solved: { type: Number, required: false, default: 0 },
        like: { type: Number, required: false, default: 0 },
        dislike: { type: Number, required: false, default: 0 },
        likedby: [
            {
                type: String, required: false
            }
        ],
        dislikedby: [
            {
                type: String, required: false
            }
        ],
    })
);

module.exports = File;