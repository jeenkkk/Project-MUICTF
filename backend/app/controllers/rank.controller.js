const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Topic = db.topic;
const File = db.file;
exports.findmatches = async (req, res) => {
    try {
        // Extract user information from token
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            // If Authorization header is missing, send a 401 Unauthorized response
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        // Extract the token part from the Authorization header
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(404).send({ message: "User not found." });
        }
        if (currentUser.availability.includes("match")) {
            const opponentId = currentUser.availability.split('-')[1];
            const opponent = await User.findOne({ _id: opponentId });
            console.log(currentUser.username);
            console.log(opponent.username);
            currentUser.rankscore -= 10;
            opponent.availability = "true";
            opponent.rankscore += 10;
        }

        // Update current user's availability to false
        currentUser.availability = "false";
        await currentUser.save();

        // Find potential match
        const potentialMatch = await User.findOne({
            _id: { $ne: currentUser._id }, // Exclude the current user
            availability: "false", // Match availability set to false
            //rankscore: { $gte: currentUser.rankscore - 100, $lte: currentUser.rankscore + 100 }
        });

        // If potential match is found
        if (potentialMatch) {
            // Change availability of current user to "match"
            currentUser.availability = "match" + currentUser._id + "-" + potentialMatch._id;
            await currentUser.save();

            // Change availability of found user to "match"
            potentialMatch.availability = "match" + potentialMatch._id + "-" + currentUser._id;
            await potentialMatch.save();
            // Emit event to notify clients about the match
            req.app.get('io').emit('match', { message: currentUser });

            res.status(200).json({ match: potentialMatch });
        } else {
            res.status(200).json({ message: "No potential match found." });
        }
    } catch (error) {
        //console.error("Error in finding matches:", error);
        res.status(500).json({ message: "Error in finding matches." });
    }
};
exports.findmatchestopic = async (req, res) => {
    try {
        // Extract user information from token
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            // If Authorization header is missing, send a 401 Unauthorized response
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        // Extract the token part from the Authorization header
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const currentUser = await User.findById(decoded.id);
        const opponentId = currentUser.availability.split('-')[1];
        const opponent = await User.findOne({ _id: opponentId });
        if (!currentUser) {
            return res.status(404).send({ message: "User not found." });
        }
        if (currentUser.availability.includes("match")) {
            currentUser.rankscore -= 10;
            opponent.rankscore += 10;
        }

        // Update current user's availability to false
        currentUser.availability = "false";
        await currentUser.save();

        // Find potential match
        const potentialMatch = await User.findOne({
            _id: { $ne: currentUser._id }, // Exclude the current user
            availability: "false", // Match availability set to false
            //rankscore: { $gte: currentUser.rankscore - 100, $lte: currentUser.rankscore + 100 }
        });

        // If potential match is found
        if (potentialMatch) {
            // Change availability of current user to "match"
            currentUser.availability = "match" + currentUser._id + "-" + potentialMatch._id;
            await currentUser.save();

            // Change availability of found user to "match"
            potentialMatch.availability = "match" + potentialMatch._id + "-" + currentUser._id;
            await potentialMatch.save();
            // Emit event to notify clients about the match
            req.app.get('io').emit('match', { message: "potentialMatch" });

            res.status(200).json({ match: potentialMatch });
        } else {
            res.status(200).json({ message: "No potential match found." });
        }
    } catch (error) {
        //console.error("Error in finding matches:", error);
        res.status(500).json({ message: "Error in finding matches." });
    }
};





const randomquestion = [];
exports.randomquestion = async (req, res) => {
    //console.log("Random question");
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            // If Authorization header is missing, send a 401 Unauthorized response
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        // Extract the token part from the Authorization header
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const currentUser = await User.findById(decoded.id);
        const opponentId = currentUser.availability.split('-')[1];
        const opponent = await User.findOne({ _id: opponentId });

        // Check if both currentUser and opponent are available
        if (currentUser.availability.includes(opponentId) && opponent.availability.includes(currentUser._id)) {
            if (randomquestion.length > 0) {
                req.app.get('io').emit('randomQuestion', { message: randomquestion[0] });
                randomquestion.pop(); // Remove the question from the array
                res.status(200).json(randomquestion[0]);
                return;
            }

            try {
                const question = await File.aggregate([{ $sample: { size: 1 } }]);
                randomquestion.push(question[0].problemname);
            } catch (error) {
                //console.error("Error in fetching random question:", error);
                res.status(500).json({ message: "Error in fetching random question." });
                return;
            }
        }
        else {
            //console.error("Both users are not available");
            res.status(500).json({ message: "Both users are not available." });
            return;
        }
    } catch (error) {
        //console.error("Error in fetching random question:", error);
        res.status(500).json({ message: "Error in fetching random question." });
        return;
    }
};


const randomquestionfromtopic = [];
let randomtopic = ""; // Changed from const to let
let secondplayeraccept = 0;
exports.randomquestionfromtopic = async (req, res) => {
    try {
        secondplayeraccept += 1;
        randomquestionfromtopic.push(req.params.topic);
        const firstplayertopic = randomquestionfromtopic[0].split(",!,!");
        if (randomquestionfromtopic.length > 1) {
            const secondplayertopic = randomquestionfromtopic[1].split(",!,!");
            const sametopic = firstplayertopic.filter(value => secondplayertopic.includes(value));
            const randomIndex = Math.floor(Math.random() * sametopic.length);
            randomtopic = sametopic[randomIndex - 1]; // Reassigned value
        }
        if (randomtopic !== "" && secondplayeraccept === 2) {
            try {
                Topic.findOne({ topic: randomtopic }, (err, topic) => {
                    const question = topic.Question[Math.floor(Math.random() * topic.Question.length)];
                    secondplayeraccept = 0;
                    req.app.get('io').emit('randomQuestion', { message: question });
                });
            } catch (error) {
                console.error("Error in fetching random question:", error);
                res.status(500).json({ message: "Error in fetching random question." });
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error in fetching random question." });
    }

};

exports.checkanswerrank = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            // If Authorization header is missing, send a 401 Unauthorized response
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        // Extract the token part from the Authorization header
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const currentUser = await User.findById(decoded.id);
        if (currentUser.availability === "true") {
            return res.status(404).send({ message: "User not available." });
        }
        const opponentId = currentUser.availability.split('-')[1];
        const opponent = await User.findOne({ _id: opponentId });
        if (opponent.availability === "true") {
            req.app.get('io').emit('matchCanceled', { message: "matchCanceled" });
            return res.status(404).send({ message: "Opponent not available." });
        }
        const question = await File
            .findOne({ problemname: req.body.problemname });
        if (!question) {
            return res.status(404).send({ message: "Question not found." });
        }
        if (req.body.answer === question.answer) {
            // Extract user information from token

            if (!currentUser) {
                return res.status(404).send({ message: "User not found." });
            }
            if (opponent.availability === "false") {
                opponent.rankscore += 10;
            }
            // Update rank score of the user
            currentUser.rankscore += 10;
            opponent.rankscore -= 10;
            currentUser.matches += 1;
            opponent.matches += 1;
            currentUser.wins += 1;
            req.app.get('io').emit('done', { message: 'match' + currentUser + "-" + opponentId });
            opponent.availability = "true";
            currentUser.availability = "true";
            await opponent.save();
            await currentUser.save();

            res.status(200).json({ message: "Correct answer! Rank score increased by 10." });
        } else {
            res.status(200).json({ message: "Incorrect answer! Try again." });
        }
    }
    catch (error) {
        //console.error("Error in checking answer:", error);
        res.status(500).json({ message: "Error in checking answer." });
    }
}
exports.cancelmatch = async (req, res) => {
    //console.log("Canceling match");
    try {
        // Extract user information from token
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            // If Authorization header is missing, send a 401 Unauthorized response
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        // Extract the token part from the Authorization header
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, config.secret);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(404).send({ message: "User not found." });
        }
        const opponentId = currentUser.availability.split('-')[1];
        const opponent = await User.findOne({ _id: opponentId });
        randomquestion.pop(); // Remove the question from the array
        //console.log(randomquestion);
        if (opponent) {
            // Handle case where opponent is not found
            opponent.availability = "true";
            await opponent.save();
        }

        // Update availability of current user to true
        currentUser.availability = "true";
        await currentUser.save();

        req.app.get('io').emit('matchCanceled', { message: "matchCanceled" });
        res.status(200).json({ message: "Match canceled successfully." });
    } catch (error) {
        console.error("Error in canceling match:", error);
        res.status(500).json({ message: "Error in canceling match." });
    }
};

exports.leaderboard = async (req, res) => {
    try {
        // Assuming User has a role field indicating the role of the user
        const users = await User.find({ roles: 'Student' });
        //console.log("Users:", users);
        // Now users is an array of User objects. You need to map it to extract required fields
        const userResults = users.map(user => ({
            username: user.username,
            email: user.email,
            points: user.rankscore,
            matches: user.matches,
            wins: user.wins,
        }));
        res.status(200).send(userResults);
    } catch (error) {
        console.error("Error in fetching all users:", error);
        res.status(500).json({ message: "Error in fetching all users." });
    }
};

