const db = require("../models");
const User = db.user;
const File = db.file;
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const fs = require('fs');
const Topic = require("../models/topic.model");
const Course = require("../models/course.model");
const Pather = require("path");
const specialCharactersRegex = /[%&<>"'/]/;
exports.upload = async (req, res) => {
    if (req.body.problemName == null || req.body.problemName == "" || req.body.Topic == null || req.body.Topic == "" || req.body.answer == null || req.body.answer == "") {
        return res.status(400).send({ message: "Failed! Name, Topic, Answer are required" });
    }
    if (req.file == undefined) {
        return res.status(400).send({ message: "Failed! File is required" });
    }
    if (specialCharactersRegex.test(req.body.problemName) || specialCharactersRegex.test(req.body.Topic) || specialCharactersRegex.test(req.file.originalname)) {
        return res.status(400).send({ message: "Failed! Special characters are not allowed" });
    }
    if (req.file.size > 10485760) {
        return res.status(400).send({ message: "Failed! File size is too large" });
    }
    if (req.body.score < 0) {
        return res.status(400).send({ message: "Failed! Score cannot be negative" });
    }


    try {
        if (req.body.course !== null && req.body.course !== "") {
            const fileobj = new File({
                problemname: req.body.problemName,
                topic: req.body.Topic,
                description: req.body.description,
                score: req.body.score,
                answer: req.body.answer,
                filename: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
            });
            const file = await File.create(fileobj);
            Topic.findOne({ Name: req.body.Topic }, function (err, topic) {
                if (err) {
                    return res.status(404).send({ message: "Upload Fail" });
                }
                if (!topic) {
                    return res.status(404).send({ message: "Topic not found" });
                }
                if (topic.Question.includes(req.body.problemName)) {
                    return res.status(404).send({ message: "Question already exists" });
                }
                topic.Question.push(req.body.problemName);
                topic.save();
            });
            Course.findOne({ Name: req.body.course }, function (err, course) {
                if (err) {
                    return res.status(404).send({ message: "Upload Fail" });
                }
                if (!course) {
                    return res.status(404).send({ message: "Course not found" });
                }
                if (course.Question.includes(req.body.problemName)) {
                    return res.status(404).send({ message: "Question already exists" });
                }
                course.Question.push(req.body.problemName);
                course.save();
            });
            res.status(200).json({ path: `${process.env.API_URL}/api/downloadfile/` + file._id });
        } else {
            const fileobj = new File({
                problemname: req.body.problemName,
                topic: req.body.Topic,
                description: req.body.description,
                score: req.body.score,
                answer: req.body.answer,
                filename: req.file.originalname,
                path: req.file.path,
                size: req.file.size,
            });
            const file = await File.create(fileobj);
            Topic.findOne({ Name: req.body.Topic }, function (err, topic) {
                if (err) {
                    return res.status(404).send({ message: "Upload Fail" });
                }
                if (!topic) {
                    return res.status(404).send({ message: "Topic not found" });
                }
                if (topic.Question.includes(req.body.problemName)) {
                    return res.status(404).send({ message: "Question already exists" });
                }
                topic.Question.push(req.body.problemName);
                topic.save();
            });

            res.status(200).json({ path: `${process.env.API_URL}/api/downloadfile/` + file._id });
        }
    }
    catch (err) {
        res.status(500).send({ message: "Upload Fail" });
    }
};

exports.uploadproblem = async (req, res) => {
    //console.log(req.body);
    if (req.body.problemName == null || req.body.problemName == "" || req.body.Topic == null || req.body.Topic == "" || req.body.answer == null || req.body.answer == "") {
        return res.status(400).send({ message: "Failed! Name, Topic, Answer are required" });
    }
    if (specialCharactersRegex.test(req.body.problemName) || specialCharactersRegex.test(req.body.Topic)) {
        return res.status(400).send({ message: "Failed! Special characters are not allowed" });
    }
    try {
        if (req.body.course !== null && req.body.course !== "") {
            const fileobj = new File({
                score: req.body.score,
                problemname: req.body.problemName,
                topic: req.body.Topic,
                description: req.body.description,
                answer: req.body.answer,
                filename: "No file",
                path: "No file",
                size: "No file",
            });
            const file = await File.create(fileobj);
            Topic.findOne({ Name: req.body.Topic }, function (err, topic) {
                if (err) {
                    return res.status(404).send({ message: "Upload Fail" });
                }
                if (!topic) {
                    return res.status(404).send({ message: "Topic not found" });
                }
                if (topic.Question.includes(req.body.problemName)) {
                    return res.status(404).send({ message: "Question already exists" });
                }
                topic.Question.push(req.body.problemName);
                topic.save();
            });
            Course.findOne({ Name: req.body.course }, function (err, course) {
                if (err) {
                    return res.status(404).send({ message: "Upload Fail" });
                }
                if (!course) {
                    return res.status(404).send({ message: "Course not found" });
                }
                if (course.Question.includes(req.body.problemName)) {
                    return res.status(404).send({ message: "Question already exists" });
                }
                course.Question.push(req.body.problemName);
                course.save();
            });
            res.status(200).json({ message: "Problem was created successfully!" });
        } else {
            const fileobj = new File({
                score: req.body.score,
                problemname: req.body.problemName,
                topic: req.body.Topic,
                description: req.body.description,
                answer: req.body.answer,
                filename: "No file",
                path: "No file",
                size: "No file",
            });
            const file = await File.create(fileobj);
            Topic.findOne({ Name: req.body.Topic }, function (err, topic) {
                if (err) {
                    return res.status(404).send({ message: "Upload Fail" });
                }
                if (!topic) {
                    return res.status(404).send({ message: "Topic not found" });
                }
                if (topic.Question.includes(req.body.problemName)) {
                    return res.status(404).send({ message: "Question already exists" });
                }
                topic.Question.push(req.body.problemName);
                topic.save();
            });
            res.status(200).json({ message: "Problem was created successfully!" });
        }
    }
    catch (err) {
        res.status(500).send({ message: "Upload Fail" });
    }
}

exports.getallproblem = async (req, res) => {
    try {
        File.find({}).exec((err, files) => {
            if (err) {
                res.status(404).send({ message: "Problem not found" });
                return;
            }
            res.status(200).send(
                {
                    problemname: files.map((file) => file.problemname),
                }
            );
        });
    } catch (err) {
        res.status(500).send({ message: "Problem not found" });
    }
};

exports.getfile = async (req, res) => {
    try {
        File.findOne({
            problemname: req.params.filename,
        }).exec((err, file) => {
            console.log(file);
            if (err) {
                res.status(404).send({ message: "Problem not found" });
                return;
            }
            if (!file) {
                res.status(404).send({ message: "Problem not found" });
                return;
            } else {
                res.status(200).send(
                    {
                        _id: file._id,
                        problemname: file.problemname,
                        topic: file.topic,
                        description: file.description,
                        score: file.score,
                        filename: file.filename,
                        path: file.path,
                        size: file.size,
                        solved: file.solved,
                        like: file.like,
                        dislike: file.dislike,
                        likedby: file.likedby,
                        dislikedby: file.dislikedby,
                        feedback: file.feedback,
                    }
                );
            }
        });

    }
    catch (err) {
        res.status(500).send({ message: "Problem not found" });
    }
};


exports.downloadfile = async (req, res) => {
    //console.log(req.params._id);
    try {
        const file = await File.findById(req.params._id);
        if (!file) {
            return res.status(404).send({ message: "File Not found." });
        }
        await file.save();
        res.download(file.path, file.filename);
    }
    catch (err) {
        res.status(500).send({ message: "File Not found." });
    }
};

exports.checkanswer = async (req, res) => {
    try {
        //console.log(req.body);
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

        File.findOne({
            problemname: req.body.problemname,
        }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: "Something went wrong" });
                return;
            }
            if (file.answer === req.body.answer) {
                if (user.Question.includes(req.body.problemname)) { // check if user already solve the question
                    res.status(200).send({ message: "Already Solved" });
                }
                else {
                    user.Question.push(req.body.problemname); // add question to user to keep track of solved question
                    file.solved += 1; // increment the number of solved question
                    user.score += file.score; // add score to user
                    user.save();
                    file.save();
                    res.status(200).send({ message: "Correct" });
                }
            }
            else {
                res.status(200).send({ message: "Incorrect" });
            }
        });

    }
    catch (err) {
        res.status(500).send({ message: "Something went wrong" });
    }
};

exports.deletequestion = async (req, res) => {
    try {
        File.findOne({
            problemname: req.params.problemname,
        }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            delpath = file.path;
            if (delpath !== "No file") {
                fs.unlink(delpath, (err) => {
                    if (err) {
                        res.status(404).send({ message: err });
                        return;
                    }
                });
            }
            File.deleteOne({ problemname: req.params.problemname }, function (err) {
                if (err) return res.status(404).send({ message: err });
            });
            Topic.findOne({ Name: file.topic }, function (err, topic) {
                if (err) {
                    return res.status(404).send({ message: err });
                }
                if (!topic) {
                    return res.status(404).send({ message: "Topic not found" });
                }
                topic.Question = topic.Question.filter(e => e !== req.params.problemname);
                topic.save();
            });

            Course.find({}, function (err, courses) {
                if (err) {
                    return res.status(404).send({ message: err });
                }
                for (var i = 0; i < courses.length; i++) {
                    courses[i].Question = courses[i].Question.filter(e => e !== req.params.problemname);
                    courses[i].save();
                }
            });
            User.find({}, function (err, users) {
                if (err) {
                    return res.status(404).send({ message: err });
                }
                for (var i = 0; i < users.length; i++) {
                    users[i].Question = users[i].Question.filter(e => e !== req.params.problemname);
                    users[i].save();
                }
            });
            res.status(200).send({ message: "Question was deleted successfully!" });
        });

    }
    catch (err) {
        res.status(500).send({ message: "Something went wrong" });
    }
}

exports.updatequestion = async (req, res) => {
    if (specialCharactersRegex.test(req.body.problemName) || specialCharactersRegex.test(req.body.Topic) || specialCharactersRegex.test(req.body.answer)) {
        return res.status(400).send({ message: "Failed! Special characters are not allowed" });
    }
    if (req.body.problemName == null || req.body.problemName == "" || req.body.Topic == null || req.body.Topic == "" || req.body.answer == null || req.body.answer == "") {
        return res.status(400).send({ message: "Failed! Name, Topic, Answer are required" });
    }
    try {
        File.findOne({
            problemname: req.body.problemName,
        }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: "Cannot update question" });
                return;
            }
            file.topic = req.body.Topic;
            file.score = req.body.score;
            file.description = req.body.description;
            file.answer = req.body.answer;
            file.save();
            res.status(200).send({ message: "Question was updated successfully!" });
        });

    }
    catch (err) {
        res.status(500).send({ message: "Cannot update question" });
    }
}

exports.updatefile = async (req, res) => {
    if (specialCharactersRegex.test(req.body.problemName) || specialCharactersRegex.test(req.body.Topic)) {
        return res.status(400).send({ message: "Failed! Special characters are not allowed" });
    }
    if (req.body.problemName == null || req.body.problemName == "" || req.body.Topic == null || req.body.Topic == "") {
        return res.status(400).send({ message: "Failed! Name, Topic are required" });
    }
    if (req.file == undefined) {
        return res.status(400).send({ message: "Failed! File is required" });
    }
    if (specialCharactersRegex.test(req.file.originalname)) {
        return res.status(400).send({ message: "Failed! Special characters are not allowed" });
    }
    try {
        File.findOne({
            problemname: req.body.problemName,
        }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: "Cannot update file" });
                return;
            }
            fs.unlink(file.path, (err) => {
                if (err) {
                    res.status(404).send({ message: "Cannot update file" });
                    return;
                }
            });
            file.topic = req.body.Topic;
            file.score = req.body.score;
            file.description = req.body.description;
            file.answer = req.body.answer;
            file.filename = req.file.originalname;
            file.path = req.file.path;
            file.size = req.file.size;

            file.save();
            res.status(200).send({ message: "Question was updated successfully!" });

        });

    }
    catch (err) {
        res.status(500).send({ message: "Cannot update file" });
    }
}

exports.sendfeedback = async (req, res) => {
    try {
        if (req.body.feedback === "") {
            return res.status(404).send({ message: "Feedback is required!" });
        }
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

        File.findOne({
            problemname: req.body.problemname,
        }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: "Something went wrong" });
                return;
            }
            file.feedback.push(req.body.feedback);
            file.userfeedback.push(user.username);
            file.save();
            res.status(200).send({ message: "Feedback was submitted successfully!" });
        });

    }
    catch (err) {
        res.status(500).send({ message: "Something went wrong" });
    }
}

exports.getfeedback = async (req, res) => {
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

        File.find({}).exec((err, files) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            var feedbacks = []; // array to store feedbacks
            for (var i = 0; i < files.length; i++) { // loop through all the questions
                for (var j = 0; j < files[i].feedback.length; j++) { // loop through all the feedbacks
                    feedbacks.push({
                        name: files[i].problemname,
                        description: files[i].feedback[j],
                        user: files[i].userfeedback[j],
                        topic: files[i].topic,
                    });
                }
            }
            res.status(200).send(feedbacks);
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }

}

exports.deletefeedback = async (req, res) => {
    try {
        File.findOne({
            problemname: req.body.name,
        }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            file.feedback = file.feedback.filter(e => e !== req.body.description); // remove feedback
            const indexToRemove = file.userfeedback.findIndex(feedback => feedback === req.body.user);
            if (indexToRemove !== -1) {
                file.userfeedback.splice(indexToRemove, 1);
            }
            file.save();
            res.status(200).send({ message: "Feedback was deleted successfully!" });
        });
    }
    catch (err) {
        res.status(500).send({ message: err });
    }
}

exports.likeordislike = async (req, res) => {
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

        File.findOne({ problemname: req.body.problemname }).exec((err, file) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            if (req.body.likeordislike === 'like') {
                if (file.likedby.includes(user.username)) {
                    file.likedby = file.likedby.filter(e => e !== user.username);
                    file.like -= 1;
                }
                else {
                    file.likedby.push(user.username);
                    file.like += 1;
                    if (file.dislikedby.includes(user.username)) {
                        file.dislikedby = file.dislikedby.filter(e => e !== user.username);
                        file.dislike -= 1;
                    }
                }
            }
            else {
                if (file.dislikedby.includes(user.username)) {
                    file.dislikedby = file.dislikedby.filter(e => e !== user.username);
                    file.dislike -= 1;
                }
                else {
                    file.dislikedby.push(user.username);
                    file.dislike += 1;
                    if (file.likedby.includes(user.username)) {
                        file.likedby = file.likedby.filter(e => e !== user.username);
                        file.like -= 1;
                    }
                }
            }
            file.save();
            res.status(200).send({ message: "Vote was submitted successfully!" });
        });

    }
    catch (err) {
        res.status(500).send({ message: err });
    }
}

