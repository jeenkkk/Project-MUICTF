const db = require("../models");

const ROLES = db.ROLES;
const challenge = require('../models/challenge.model');

checkDuplicatechallenge = (req, res, next) => {
    // Name
    try {
        challenge.findOne({
            Name: req.body.Name
        }).exec((err, challenge) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }

            if (challenge) {
                res.status(404).send({ message: "Failed! Name is already in use!" });
                return;
            }

            // Download_Link
            challenge.findOne({
                Download_Link: req.body.Download_Link
            }).then((err, challenge) => {
                if (err) {
                    res.status(404).send({ message: err });
                    return;
                }

                if (challenge) {
                    res.status(404).send({ message: "Failed! Download_Link is already in use!" });
                    return;
                }

                next();
            });
        });
    } catch (err) {
        res.status(500).send({ message: err });
    }
    
};

const verifychallenge = {
    checkDuplicatechallenge,
};

module.exports = verifychallenge;