const db = require("../models");
const Course = db.course;

checkduplicatecourse = (req, res, next) => {
    try {
        Course.findOne({
            Name: req.body.Name
        }).exec((err, course) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }

            if (course) {
                res.status(404).send({ message: "Failed! Course is already in use!" });
                return;
            }
            next();
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
    
}

module.exports = checkduplicatecourse;