const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var bcrypt = require("bcryptjs");


exports.deleteuser = (req, res) => { //delete user
    //console.log(req);
    try {
        User.findOneAndDelete({ username: req.params.user }, function (err, user) {
            if (err) {
                return res.status(500).send({ message: "Error deleting user" });
            }
            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
            return res.status(200).send({ message: "User deleted successfully" });
        });
    } catch (err) {
        res.status(404).send({ message: "Fail to delete user" });
    }
};

exports.alluser = (req, res) => { //get all users
    try {
        User.find({}).exec((err, users) => {
            if (err) {
                res.status(404).send({ message: err });
                return;
            }
            res.status(200).send(users);
        });
    } catch (err) {
        res.status(404).send({ message: "Fail to get all users" });
    }
};

exports.updateuser = (req, res) => { //update 1 user
    try {
        User.findOne({
            username: req.params.user,
        })
            .exec((err, user) => { // execute
                if (err) {
                    res.status(404).send({ message: "Fail to update user" });
                    return;
                }

                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                if (req.body.password) {
                    User.updateOne({ username: req.params.user }, { password: bcrypt.hashSync(req.body.password, 8) }, function (err) {
                        if (err) return res.status(404).send(handleError(err));
                        else return res.status(200).send({ message: req.params.user + " updated." });
                    });
                }
                if (req.body.email) {
                    User.updateOne({ username: req.params.user },
                        //{ password: bcrypt.hashSync(req.body.password, 8) }, 
                        { email: req.body.email },
                        function (err) {
                            if (err) return res.status(404).send(handleError(err));
                            else return res.status(200).send({ message: req.params.user + " updated." });
                        }

                    );
                }
                if (req.body.roles) {
                    Role.find(
                        {
                            name: { $in: req.body.roles },
                        },
                        (err, roles) => {
                            if (err) {
                                res.status(404).send({ message: "Fail to update user" });
                                return;
                            }

                            user.roles = roles.map((role) => role._id);
                            user.save((err) => {
                                if (err) {
                                    res.status(404).send({ message: "Fail to update user" });
                                    return;
                                }

                                res.send({ message: "User was updated successfully!" });
                            });
                        }
                    );
                }

            });
    } catch (err) {
        res.status(404).send({ message: "Fail to update user" });
    }
}

exports.updatemultipleuser = (req, res) => { //update multiple user
    try {
        const newpassword = req.body.password;
        const newemail = req.body.email;
        const newroles = req.body.roles;
        const username = req.params.user;

        User.findOne({
            username: username,
        })
            .exec((err, user) => { // execute
                if (err) {
                    res.status(400).send({ message: err });
                    return;
                }

                if (!user) {
                    return res.status(400).send({ message: "User Not found." });
                }
                if (newpassword !== "") {
                    User.updateOne({ username: username }, {
                        password: bcrypt.hashSync(newpassword, 8)
                    }, function (err) {

                        if (err) return res.status(400).send(handleError(err));
                        else {
                            return res.status(200).send({ message: "Email updated." });
                        }
                    });
                }
                if (newemail !== "") {
                    User.updateOne({ username: username }, {
                        email: newemail
                    }, function (err) {

                        if (err) return res.status(400).send(handleError(err));
                        else {
                            return res.status(200).send({ message: "Email updated." });
                        }
                    });
                }
                if (newroles !== "") {
                    User.updateOne({ username: username }, {
                        roles: newroles
                    }, function (err) {

                        if (err) return res.status(400).send(handleError(err));
                        else {
                            return res.status(200).send({ message: "Email updated." });
                        }
                    });
                }

            });
    } catch (err) {
        res.status(400).send({ message: "Fail to update user" });
    }
}


