const { login, logout, logon } = require('../controller');
const {
  verifyProps,
  makeReturnData,
  setSession,
  getCookieExpireTime,
  getCookieExpireDate,
} = require('../utils');
const { loginInOnErrMsg, serverErrMsg } = require('../config/error');
const { loginInOnMsg } = require('../config/msg');
const { ErrorModel } = require('../model');

const { INVALID_USERNAME_PASSWORD, PASSWORD_NOT_MATCH } = loginInOnErrMsg;
const { LOGIN_SUCCEEDED } = loginInOnMsg;
const { SERVER_ISSUE } = serverErrMsg;

const handleLogInOnRoute = async (req, res) => {
  // TODO move verification to another layer between router and controller
  const { method, route, body = {}, cookie } = req;
  const { username, password, confirmPassword } = body;
  const props = { username, password };
  const propRules = { username: 3, password: 3 };
  const { userid } = cookie;

  // TODO setup session verification process
  const verifySession = () => {};

  // login
  if (method === 'POST' && route === '/api/login') {
    if (verifyProps(propRules, props)) {
      const response = await login(username, password);
      const { error, result } = response;
      if (error === null) {
        const { id: authorId } = result;
        const userId = req.cookie.userid;
        // get expiration timestamp
        const expTs = getCookieExpireTime();
        // get expiration date
        const expDate = getCookieExpireDate(expTs);
        const { error: err } = await setSession(
          userId,
          JSON.stringify(result),
          expTs
        );
        if (err === null) {
          // if set session succeeded
          // set/refresh expiration date for cookie
          res.setHeader(
            'Set-cookie',
            `userid=${userId}; path=/; httpOnly; expires=${expDate}`
          );
          response.result = { msg: LOGIN_SUCCEEDED, authorId };
        } else {
          // if set session failed
          response.error = SERVER_ISSUE;
          response.result = undefined;
        }
      }

      return makeReturnData(response);
    }
    return new ErrorModel(INVALID_USERNAME_PASSWORD);
  }

  // TODO
  // logout
  if (method === 'POST' && route === '/api/logout') {
    if (verifySession(userid)) {
      const response = await logout(userid);
      return makeReturnData(response);
    }
    return new ErrorModel(INVALID_USERNAME_PASSWORD);
  }

  // logon
  if (method === 'POST' && route === '/api/logon') {
    if (password !== confirmPassword) return new ErrorModel(PASSWORD_NOT_MATCH);
    if (verifyProps(propRules, props)) {
      const response = await logon(username, password);
      return makeReturnData(response);
    }
    return new ErrorModel(INVALID_USERNAME_PASSWORD);
  }

  return undefined;
};

module.exports = handleLogInOnRoute;
