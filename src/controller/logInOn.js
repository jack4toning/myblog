const { loginInOnErrMsg } = require('../config/error');
const { query } = require('../db/mysql');

const { USER_EXISTS, INVALID_USERNAME_PASSWORD, LOGIN_FAILED, LOGON_FAILED } =
  loginInOnErrMsg;
// // TODO setup get session process
// const userId = '123';
// TODO setup session verification process
// const verifySession = () => {};
const revokeSession = () => {};

const login = (username, password) =>
  new Promise((resolve) => {
    const sql = `select id, username from users where username = '${username}' and password = '${password}';`;
    query(sql, (err, result) => {
      let error = err;

      if (error) error = LOGIN_FAILED;
      else if (result.length === 0) error = INVALID_USERNAME_PASSWORD;

      resolve({ error, result: error !== null ? undefined : result[0] });
    });
  });

const logout = (t) =>
  new Promise((resolve) => {
    revokeSession(t);
    resolve({ error: null, result: undefined });
  });

const addUser = (username, password) =>
  new Promise((resolve) => {
    const sql = `insert into users (username, password) values ('${username}', '${password}')`;
    query(sql, (err, result) => {
      let error = err;

      if (error || result.affectedRows === 0) error = LOGON_FAILED;

      resolve({ error, result: undefined });
    });
  });

const logon = (username, password) =>
  new Promise((resolve) => {
    const sql = `select username from users where username = '${username}';`;
    query(sql, async (err, result) => {
      let error = err;

      if (error) error = LOGIN_FAILED;
      else if (result.length !== 0) error = USER_EXISTS;

      if (error !== null) resolve({ error, result: undefined });
      else resolve(await addUser(username, password));
    });
  });

module.exports = { login, logout, logon };
