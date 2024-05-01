const db = require("../models");
const User = db.user;
const Role = db.role;
const Topic = db.topic;
const Course = db.course;
const bcrypt = require("bcryptjs");


// topic controller
exports.createtopic = (req, res, next) => { //create topic
    try {
        const topic = new Topic({
            Name: req.body.Name,
        });
        if (req.body.Name == "" || req.body.Name == null) return res.status(404).send({ message: "Topic Name is required." });
        if (req.body.Name === Topic.Name) {
            return res.status(404).send({ message: "Topic already exists." });
        }

        topic.save((err, topic) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            else {
                topic.save(() => { // save topic to database
                    return res.status(200).send({ message: "Topic was created successfully!" });

                }
                );
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.deletetopic = (req, res) => { //delete topic
    try {
        const topicname = req.params.topic; // Assuming the topic ID is passed as a parameter
        Topic.findOneAndDelete({ Name: topicname }, function (err, topic) {
            if (err) {
                return res.status(500).send({ message: "Error deleting topic" });
            }
            if (!topic) {
                return res.status(404).send({ message: "Topic not found" });
            }
            return res.status(200).send({ message: "Topic deleted successfully" });
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};

exports.alltopic = (req, res) => { //get all topics
    try {
        Topic.find({}).exec((err, topics) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            const data = topics.map(topic => ({
                Name: topic.Name,
                Question: topic.Question
            }));
            res.status(200).send(data);
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.gettopic = (req, res) => { //get 1 topic
    try {
        Topic.findOne({
            Name: req.params.topic,
        })
            .exec((err, topic) => {
                if (err) {
                    res.status(404).send({ message: err });
                    return;
                }

                if (!topic) {
                    return res.status(404).send({ message: "Topic Not found." });
                }
                res.status(200).send(
                    {
                        Name: topic.Name,
                        Question: topic.Question
                    }
                );
            }
            );
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.updatetopic = (req, res) => { //update 1 topic
    console.log(req.body);
    console.log(req.params);
    try {
        const newtopic = req.params.topic; // Destructure topic name and new name from request body
        const current = req.body.current;
        Topic.findOne({
            Name: current, // Using the topic name from the request body
        })
            .exec((err, foundTopic) => { // Renamed `topic` to `foundTopic` for clarity
                if (err) {
                    res.status(500).json({ message: err });
                    return;
                }

                if (!foundTopic) {
                    return res.status(404).json({ message: "Topic not found." });
                }

                // Update the topic name
                foundTopic.Name = newtopic; // Assign new name to the found topic
                foundTopic.save((err, updatedTopic) => { // Save the updated topic
                    if (err) {
                        res.status(500).json({ message: err });
                        return;
                    }
                    res.status(200).json({ message: `Topic ${current} updated. New Topic: ${updatedTopic.Name}` });
                });
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

// course controller

exports.createcourse = (req, res, next) => { //create course
    try {
        const course = new Course({
            Name: req.body.Name,
        });
        if (req.body.Name == "" || req.body.Name == null) return res.status(404).send({ message: "Course Name is required." });
        if (req.body.Name === Course.Name) {
            //console.log(req.body.Name, course.Name);
            return res.status(404).send({ message: "Course already exists." });
        }
        course.save((err, course) => {
            if (err) {
                res.status(400).send({ message: err });
                return;
            }
            else {
                course.save(() => { // save course to database
                    return res.status(200).send({ message: "Course was created successfully!" });
                }
                );
            }
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.deletecourse = (req, res) => {
    try {
        const coursename = req.params.course; // Assuming the course ID is passed as a parameter
        Course.findOneAndDelete({ Name: coursename }, function (err, course) {
            if (err) {
                return res.status(500).send({ message: "Error deleting course" });
            }
            if (!course) {
                return res.status(404).send({ message: "Course not found" });
            }
            return res.status(200).send({ message: "Course deleted successfully" });
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};


exports.allcourse = (req, res) => { //get all courses
    try {
        Course.find({}).exec((err, courses) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            res.status(200).send(
                courses.map(course => ({

                    Name: course.Name
                }))
            );
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

exports.getcourse = async (req, res) => {
    try {
        const course = await Course.findOne({ Name: req.params.course }).exec();

        if (!course) {
            return res.status(404).send({ message: "Course Not found." });
        }

        res.status(200).send(
            {
                Name: course.Name,
                Question: course.Question
            }
        );
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updatecourse = (req, res) => { //update 1 course
    try {
        const newcourse = req.params.course; // Destructure course name and new name from request body
        const current = req.body.current;
        Course.findOne({
            Name: current, // Using the course name from the request body
        })
            .exec((err, foundCourse) => { // Renamed `course` to `foundCourse` for clarity
                if (err) {
                    res.status(500).json({ message: err });
                    return;
                }

                if (!foundCourse) {
                    return res.status(404).json({ message: "Course not found." });
                }

                // Update the course name
                foundCourse.Name = newcourse; // Assign new name to the found course
                foundCourse.save((err, updatedCourse) => { // Save the updated course
                    if (err) {
                        res.status(500).json({ message: err });
                        return;
                    }
                    res.status(200).json({ message: `Course ${current} updated. New Course: ${updatedCourse.Name}` });
                });
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

};

exports.addquestiontocourse = (req, res) => { //add question to course
    try {
        const question = req.body.problemName;
        const course = req.params.course;
        Course.findOne({
            Name: course,
        })
            .exec((err, foundCourse) => {
                //console.log("foundCourse");
                // if question is already in the course
                if (foundCourse.Question.includes(question)) {
                    return res.status(404).json({ message: "Question already in course." });
                }
                if (err) {
                    //console.log(err);
                    res.status(500).json({ message: err });
                    return;
                }

                if (!foundCourse) {
                    //console.log("err");
                    return res.status(404).json({ message: "Course not found." });
                }

                foundCourse.Question.push(question);
                foundCourse.save((err, updatedCourse) => {
                    if (err) {
                        res.status(500).json({ message: err });
                        return;
                    }
                    res.status(200).json({ message: `Question added to ${course}` });
                });
            });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }

}

exports.getallstudent = async (req, res) => { //get all student
    try {
        User.find({ roles: "Student" }).exec((err, users) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            // Extracting required properties from each user
            const userInfos = users.map(user => ({
                username: user.username,
                roles: user.roles,
                Question: user.Question
            }));
            // Sending the extracted properties
            res.status(200).send(userInfos);
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

