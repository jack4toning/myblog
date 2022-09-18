const env = process.env.NODE_ENV;

// mysql
// default config
let mysqlConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Password4me_88',
  port: '3306',
  database: 'myblog',
};

// dev config
if (env === 'development')
  mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Password4me_88',
    port: '3306',
    database: 'myblog',
  };

// prd config
if (env === 'production')
  mysqlConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Password4me_88',
    port: '3306',
    database: 'myblog',
  };

// redis
// default config
let redisConfig = {
  port: 6379,
  host: '127.0.0.1',
};

// dev config
if (env === 'development')
  redisConfig = {
    port: 6379,
    host: '127.0.0.1',
  };

// prd config
if (env === 'production')
  redisConfig = {
    port: 6379,
    host: '127.0.0.1',
  };

module.exports = { mysqlConfig, redisConfig };
