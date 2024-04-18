const { authJwt } = require("../middlewares");
const controller = require("../controllers/challenge.controller");
const verifychallenge = require("../middlewares");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/challenge/all", authJwt.verifyToken, controller.allvuln);
    app.get("/api/challenge/:name", authJwt.verifyToken, controller.name); // need to delete later
    app.post("/api/challenge/answer/:name", authJwt.verifyToken, controller.answer);


};
