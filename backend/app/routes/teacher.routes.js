const checkduplicatetopic = require("../middlewares/verifytopic");
const checkduplicatecourse = require("../middlewares/verifycourse");
const checkvalidquestion = require("../middlewares/file");
const { authJwt } = require("../middlewares");
const File = require("../controllers/file.controller");
const upload = require("../utils/upload");
const controller = require("../controllers/teacher.controller");
const { checkDuplicatechallenge } = require("../middlewares/verifychallenge");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    // topic controller
    app.post("/api/teacher/createtopic", authJwt.verifyToken, authJwt.isteacher, checkduplicatetopic, controller.createtopic); //create topic
    app.delete("/api/teacher/deletetopic/:topic", authJwt.verifyToken, authJwt.isteacher, controller.deletetopic); //delete topic
    app.put("/api/teacher/updatetopic/:topic", authJwt.verifyToken, authJwt.isteacher, controller.updatetopic); //update topic
    app.get("/api/alltopic", controller.alltopic); //get all topics
    app.get("/api/gettopic/:topic", authJwt.verifyToken, controller.gettopic); //get 1 topic

    // course controller
    app.post("/api/teacher/createcourse", authJwt.verifyToken, authJwt.isteacher, checkduplicatecourse, controller.createcourse); //create courses
    app.delete("/api/teacher/deletecourse/:course", authJwt.verifyToken, authJwt.isteacher, controller.deletecourse); //delete courses
    app.put("/api/teacher/updatecourse/:course", authJwt.verifyToken, authJwt.isteacher, controller.updatecourse); //update courses
    app.get("/api/teacher/allcourse", controller.allcourse); //get all courses
    app.get("/api/teacher/getcourse/:course", authJwt.verifyToken, controller.getcourse); //get 1 course
    app.post("/api/teacher/addquestiontocourse/:course", authJwt.verifyToken, authJwt.isteacher, controller.addquestiontocourse); //add question to course

    // File controller
    app.post("/api/teacher/uploadfile", authJwt.verifyToken, authJwt.isteacher,  upload.single("file"),checkvalidquestion, File.upload); //upload file
    app.post("/api/teacher/uploadproblem", authJwt.verifyToken, authJwt.isteacher, checkvalidquestion, File.uploadproblem); //upload question
    app.get("/api/getallproblem", authJwt.verifyToken, File.getallproblem); //get all file (problem
    app.get("/api/getfile/:filename", authJwt.verifyToken, File.getfile); //get file
    app.get("/api/downloadfile/:_id", File.downloadfile); //download file
    //app.get("/api/downloadfile/:_id", authJwt.verifyToken, File.downloadfile); //download file
    app.post("/api/checkanswer", authJwt.verifyToken, File.checkanswer); //check answer
    app.delete("/api/deleteproblem/:problemname", authJwt.verifyToken, authJwt.isteacher, File.deletequestion); //delete problem
    //app.delete("/api/deleteproblem/:problemname", authJwt.verifyToken,authJwt.isteacher,File.deletequestion); //delete problem
    app.put("/api/updateproblem", authJwt.verifyToken, authJwt.isteacher, File.updatequestion); //update problem
    app.put("/api/updatefile", authJwt.verifyToken, authJwt.isteacher, upload.single("file"), File.updatefile); //update file

    // Feedback controller
    app.get("/api/getfeedback", authJwt.verifyToken, authJwt.isteacher, File.getfeedback); //get feedback
    app.delete("/api/deletefeedback", authJwt.verifyToken, authJwt.isteacher, File.deletefeedback); //delete feedback

    // All students controller
    app.get("/api/allstudent", authJwt.verifyToken, authJwt.isteacher, controller.getallstudent); //get all students

    // Secure route
    app.get("/api/teacher/Dashboard", authJwt.verifyToken, authJwt.isteacher);
    


};
