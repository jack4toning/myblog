// mysql
const mysql = require('mysql');
const { mysqlConfig } = require('../config/db');
// create connection pool(config)
const pool = mysql.createPool(mysqlConfig);

const query = (sql, callback, params = null) => {
  pool.getConnection((error, connection) => {
    if (error) callback(error);
    else
      connection.query(sql, params, (err, result) => {
        callback(err, result);
        connection.release();
      });
  });
};

module.exports = { query };
