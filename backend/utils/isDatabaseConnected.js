const mongoose = require("mongoose");

const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

module.exports = isDatabaseConnected;
