const blogs = require('./blogs');
const logInOn = require('./logInOn');

module.exports = {
  ...blogs,
  ...logInOn,
};
