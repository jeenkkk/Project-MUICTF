const db = require("../models");
const topic = db.topic;

checkduplicatetopic = (req, res, next) => {
    try {
        topic.findOne({
            Name: req.body.Name
        }).exec((err, topic) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }

            if (topic) {
                res.status(404).send({ message: "Failed! Topic is already in use!" });
                return;
            }
            next();
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
    
}


module.exports = checkduplicatetopic;