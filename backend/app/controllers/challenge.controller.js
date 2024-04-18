const db = require("../models");
const Challenge = db.challenge;
const User = db.user;
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
exports.name = (req, res) => {
    try {
        Challenge.findOne({ Name: req.params.name }, (error, data) => {
            if (error) {
                res.status(404).send({ message: error });
                return;
            } else {
                res.json(data);
            }
        });

    }
    catch (err) {
        res.status(500).send({ message: err });
    }
};
exports.allvuln = (req, res) => {
    try {
        Challenge.find({}, (error, data) => {
            if (error) {
                res.status(404).send({ message: error });
                return;
            } else {
                res.json(data);
            }
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
};
exports.answer = async (req, res) => {
    //console.log(req.body);
    //console.log(req.params.name);
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

        Challenge.findOne({ Name: req.params.name }, (error, data) => {
            if (error) {
                res.status(404).send({ message: "Something went wrong" });
                return;
            } else {
                if (data.Flag.includes("")) {
                    res.status(200).send({ message: "The Flag is not included yet, you can send it in the feedback." });
                    return; // Return here to stop further execution
                }
                //console.log(data.Flag);
                //console.log(req.body.Answer);
                if (user.VulnFlag.includes(req.body.Answer)) {
                    res.status(200).send({ message: "You have already submitted this flag" });
                    return; // Return here to stop further execution
                }
                if (data.Flag.includes(req.body.Answer) && !user.VulnFlag.includes(req.body.Answer)) { // Checking if req.body.Answer is included in data.Flag array
                    user.VulnQuestion.push(data.Name);
                    user.VulnFlag.push(req.body.Answer);
                    if (data.Difficulty == "Beginner") {
                        user.vulnscore += 1;
                    } else if (data.Difficulty == "Easy") {
                        user.vulnscore += 2;
                    } else if (data.Difficulty == "Medium") {
                        user.vulnscore += 3;
                    } else if (data.Difficulty == "Hard") {
                        user.vulnscore += 4;
                    } else if (data.Difficulty == "Unknown") {
                        user.vulnscore += 0.9;
                    }
                    user.save();
                    res.status(200).send({ message: "Correct +" + user.vulnscore + " points" });
                } else {
                    res.status(200).send({ message: "Incorrect" });
                }
            }
        });

    } catch (err) {
        res.status(500).send({ message: "Something went wrong" });
    }
};