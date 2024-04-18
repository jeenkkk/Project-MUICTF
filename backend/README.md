#environment
##server.js
const mongourl = "mongoURL"; // Your MongoDB URL
##config folder
###create auth.config.js
module.exports = {
  secret: "Your secret",
};
###create db.config.js
module.exports = {
  HOST: "host",
  PORT: 8080,
};
