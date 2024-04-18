# Environment

## server.js

const mongourl = "mongoURL"; // Your MongoDB URL

### create config folder in app
### create auth.config.js

module.exports = {
  secret: "Your secret",
};
### create db.config.js
module.exports = {
  HOST: "host",
  PORT: 8080,
};
