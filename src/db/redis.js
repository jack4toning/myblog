const redis = require('redis');
const { time } = require('../config/constant');

const { ONE_DAY_IN_SECS } = time;

// create client, default config with 127.0.0.1:6379
const redisClient = redis.createClient();
redisClient.on('error', (err) => {
  console.log('Redis client error', err);
});

const setRedisValue = async (key, val, expTs = ONE_DAY_IN_SECS) => {
  let error = null;
  let result = null;

  try {
    // establish connection
    await redisClient.connect();
    // set key/value pair
    await redisClient.set(key, val);
    // set expiration time
    await redisClient.pExpireAt(key, expTs);
    // gracefully close client connection
    await redisClient.quit();
    result = true;
  } catch (err) {
    error = err.message;
  }

  return { error, result };
};

const getRedisValue = async (key) => {
  let error = null;
  let result = null;

  try {
    // establish connection
    await redisClient.connect();
    // get value
    result = await redisClient.get(key);
    // gracefully close client connection
    await redisClient.quit();
  } catch (err) {
    error = err.message;
  }

  return { error, result };
};

module.exports = {
  setRedisValue,
  getRedisValue,
};
