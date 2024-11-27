const dotenv = require("dotenv");

module.exports = async () => {
  const envVars = dotenv.config().parsed;
  return envVars;
};
