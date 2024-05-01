const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const mongoose = require("mongoose");
const app = express();
const socketIo = require("socket.io");
const http = require("http");
const secret = require('./app/config/auth.config');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const corsOptions = {
  origin: 'https://proud-plant-014e26700.5.azurestaticapps.net',
  methods: "GET,PUT,POST,DELETE",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Add this after you initialize express.
app.use(session({
  secret: secret.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}));
const db = require("./app/models");
const Role = db.role;
const Challenge = db.challenge;

// connect to database
mongoose
  .connect(
    `mongodb+srv://jeen:asd123zxc456123ko@cluster0.kqdhwc7.mongodb.net/database`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {

    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/challenge.routes")(app);
require("./app/routes/admin.routes")(app);
require("./app/routes/teacher.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 80;
const server = http.createServer(app).listen(PORT, () => {
  console.log(`Server---------------------- is running on port ${PORT} ------------------------------------`);
});

const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://proud-plant-014e26700.5.azurestaticapps.net'],
    methods: ["GET", "POST"],
    credentials: true // enable set cookie
  }
});
app.set('io', io);

io.on('connection', client => {
  console.log('user connected')

  client.on('disconnect', () => {
    console.log('user disconnected')
  })

})

const fs = require('fs');
const Course = require("./app/models/course.model");
// read json file
const challenges = JSON.parse(fs.readFileSync("./vulnhub_data.json"));


function initial() {
  // create 3 roles: user, teacher, admin
  Role.estimatedDocumentCount((err, count) => { // check if there are already roles in the database
    if (!err && count != 3) {
      new Role({
        name: "Student",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Student' to roles collection");
      });

      new Role({
        name: "Teacher",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Teacher' to roles collection");
      });

      new Role({
        name: "Admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Admin' to roles collection");
      });
    }
  });

  Challenge.estimatedDocumentCount((err, count) => { // check if there are already Challenge in the database
    if (!err && count === 0) {
      Challenge.insertMany(challenges, (err) => {
        if (err) {
          console.log("error", err);
        }
        console.log("added Challenges to mongoDB");
      });
    }
  });
  Course.findOne({ Name: "Vulnhub" }, (err, course) => {
    if (err) {
      console.log("Error finding course:", err);
    } else if (!course) {
      // Course not found, create a new one
      const newCourse = new Course({
        Name: "Vulnhub",
        // Add other properties as needed
      });
      newCourse.save((err, savedCourse) => {
        if (err) {
          console.log("Error creating course:", err);
        } else {
          console.log("Course 'Vulnhub' created");
          // After creating the course, add challenges' names to it
          addChallengesToCourse(savedCourse);
        }
      });
    } else {
      console.log("Course 'Vulnhub' already exists");
      // If the course exists, directly add challenges to it
      addChallengesToCourse(course);
    }
  });

  // Function to add challenges to the course
  function addChallengesToCourse(course) {
    // Find all challenges
    Challenge.find({}, 'Name', (err, challenges) => {
      if (err) {
        console.log("Error finding challenges:", err);
      } else {
        // Extract challenge names
        const challengeNames = challenges.map(challenge => challenge.Name);
        //console.log(challengeNames);
        // Add challenge names to the course's questions
        course.Question = challengeNames;
        // Save the course
        course.save((err) => {
          if (err) {
            console.log("Error saving course:", err);
          } else {
            console.log("Challenges added to 'Vulnhub' course");
          }
        });
      }
    });
  }
}
module.exports = io;