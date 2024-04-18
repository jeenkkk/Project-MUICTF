const db = require("../models");

const file = db.file;

checkvalidquestion = (req, res, next) => {
    try {
        if (req.body.problemName == null ||
            req.body.problemName == "" ||
            req.body.Topic == null ||
            req.body.Topic == "" ||
            req.body.answer == null || req.body.answer == "") {
            return res.status(400).send({ message: "Failed! Name, Topic, Answer are required" });
        }

        // Check if filename or problemname already exists
        file.findOne({ $or: [{ filename: req.body.filename }, { problemname: req.body.problemName }] })
            .exec((err, foundFile) => {
                if (err) {
                    return res.status(400).send({ message: err });
                }

                if (foundFile) {
                    if (foundFile.filename === req.body.filename) {
                        return res.status(400).send({ message: "Failed! File name is already in use!" });
                    } else {
                        return res.status(400).send({ message: "Failed! Question is already in use!" });
                    }
                }

                // If no conflicts, proceed to the next middleware
                next();
            });
    }
    catch (err) {
        res.status(500).send({ message: err });
    }
    
}

module.exports = checkvalidquestion;
