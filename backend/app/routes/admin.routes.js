const controller = require("../controllers/admin.controller");
const { authJwt } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });
  //admin
  app.delete("/api/admin/deleteuser/:user", authJwt.verifyToken, authJwt.isAdmin, controller.deleteuser);
  app.get("/api/admin/alluser", authJwt.verifyToken, authJwt.isAdmin, controller.alluser);
  app.put("/api/admin/updateuser", authJwt.verifyToken, authJwt.isAdmin, controller.updateuser);
  app.put("/api/admin/updatemultipleuser/:user", authJwt.verifyToken, authJwt.isAdmin, controller.updatemultipleuser);
  app.get("/api/alive", (req, res) => {
    res.send("alive------");
  });
};
