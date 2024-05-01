const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const vuln = require("../controllers/challenge.controller");
const file = require("../controllers/file.controller");
const rank = require("../controllers/rank.controller");
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // profile
  app.get("/api/getinfo", authJwt.verifyToken, controller.getinfo);
  app.get("/api/progression", authJwt.verifyToken, controller.progression);
  app.put("/api/updateinfo", authJwt.verifyToken, controller.updateinfo);
  app.delete("/api/deleteuser", authJwt.verifyToken, controller.deleteuser);

  // feedback
  app.post("/api/sendfeedback", authJwt.verifyToken, file.sendfeedback);
  app.post("/api/likeordislike", authJwt.verifyToken, file.likeordislike);
  app.post("/api/sendfeedbackvulnhub", authJwt.verifyToken, file.sendfeedbackvulnhub);

  // rank
  app.get("/api/findmatches", authJwt.verifyToken, rank.findmatches);
  app.get("/api/cancelmatch", authJwt.verifyToken, rank.cancelmatch);
  app.get("/api/randomquestion", authJwt.verifyToken, rank.randomquestion);
  app.get("/api/randomquestionfromtopic/:topic", authJwt.verifyToken, rank.randomquestionfromtopic);
  app.get("/api/leaderboard", authJwt.verifyToken, rank.leaderboard);
  app.post("/api/checkanswerrank", authJwt.verifyToken, rank.checkanswerrank);
};