const { v4: uuidv4 } = require('uuid');
const { SuccessModel, ErrorModel } = require('../model');
const { redisErrMsg, serverErrMsg } = require('../config/error');
const { setRedisValue, getRedisValue } = require('../db/redis');
const { time } = require('../config/constant');

const { STRING_ONLY } = redisErrMsg;
const { SERVER_ISSUE } = serverErrMsg;
const { ONE_DAY_IN_SECS } = time;

const getPostData = (req) => {
  const { method, headers } = req;
  const methods = ['POST', 'PATCH', 'DELETE'];
  return new Promise((resolve) => {
    if (methods.findIndex((m) => m === method) === -1) {
      resolve();
      return;
    }
    if (headers['content-type'] !== 'application/json') {
      resolve();
      return;
    }
    let postData = '';
    req.on('data', (chunk) => {
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (postData === '') {
        resolve();
      } else resolve(JSON.parse(postData));
    });
  });
};

const getQueryString = (searchParams) => {
  const queryString = {};
  searchParams.forEach((val, key) => {
    queryString[key] = val;
  });
  return queryString;
};

const isStringOrNum = (value) =>
  typeof value === 'string' || typeof value === 'number';

// const trim = (str) => str.replace(/^\s*(\S+.*\S+)\s*$/, '$1');

const isAtLeast = (value, expLen) => String(value).trim().length >= expLen;

const verifyProps = (rules, props) => {
  let verifyResult = true;
  try {
    Object.entries(props).forEach((prop) => {
      const [key, val] = prop;
      if (!(isStringOrNum(val) && isAtLeast(val, rules[key])))
        throw new Error();
    });
  } catch (e) {
    verifyResult = false;
  }

  return verifyResult;
};

const getDefinedProps = (props) => {
  const validProps = {};
  Object.entries(props).forEach((prop) => {
    const [key, val] = prop;
    if (val !== undefined) validProps[key] = val;
  });

  return validProps;
};

const makeReturnData = ({ error, result }) => {
  if (error) return new ErrorModel(error);

  return new SuccessModel(result);
};

const makeKVPairs = (columns) => {
  let keyValuePairs = '';

  Object.entries(columns).forEach((column) => {
    const [key, val] = column;
    keyValuePairs += `${key} = '${val}', `;
  });
  keyValuePairs = keyValuePairs.substring(0, keyValuePairs.length - 2);

  return keyValuePairs;
};

const getCookieExpireTime = (days = 1) => {
  if (typeof days !== 'number' && Number.isNaN(days))
    throw new Error('param must be a number');

  return Date.now() + 24 * 60 * 60 * 1000 * days;
};

const getCookieExpireDate = (timestamp = Date.now() + ONE_DAY_IN_SECS) => {
  if (typeof days !== 'number' && Number.isNaN(timestamp))
    throw new Error('param must be a number');

  const d = new Date();
  d.setTime(timestamp);
  return d.toUTCString();
};

const getSession = async (key) => {
  // check if key is string
  if (typeof key !== 'string') return { error: STRING_ONLY, result: null };

  const result = await getRedisValue(key);
  return result;
};

const setSession = async (key, val, expTs) => {
  // check if key/val is string
  if (typeof key !== 'string' || typeof val !== 'string')
    return { error: STRING_ONLY, result: null };

  const result = await setRedisValue(key, val, expTs);
  return result;
};

const handleSession = async (userId, req, res) => {
  if (userId) {
    // has userid means has session
    const { error, result } = await getSession(userId);
    // if error !== null means ran into some problem related to Redis
    if (error !== null) throw new Error(SERVER_ISSUE);
    // if result !== null means value was fetched from Redis successfully
    if (result !== null) return result;
  }

  // has no userId or result === null means no session or session expired, need to set a new session and set cookie to client so that next time the user come we can recognize him/her
  // make a uuid
  const newUserId = uuidv4();
  // cache userid in req.cookie
  req.cookie.userid = newUserId;
  // get expiration timestamp
  const expTs = getCookieExpireTime();
  // get expiration date
  const expDate = getCookieExpireDate(expTs);

  // set a new session
  const { error } = await setSession(newUserId, '', expTs);
  if (error !== null) return null;

  // set cookie
  res.setHeader(
    'Set-cookie',
    `userid=${newUserId}; path=/; httpOnly; expires=${expDate}`
  );

  return '';
};

module.exports = {
  getPostData,
  getQueryString,
  verifyProps,
  getDefinedProps,
  makeReturnData,
  makeKVPairs,
  getCookieExpireTime,
  getCookieExpireDate,
  getSession,
  setSession,
  handleSession,
};
