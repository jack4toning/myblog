// const http = require('http');

// const server = http.createServer((req, res) => {
//   const { method, url, headers } = req;
//   if (method === 'GET') {
//     const sp = new URL(url, `http://${headers.host}`).searchParams;
//     let qs = {};
//     for (let [key, val] of sp.entries()) {
//       qs[key] = val;
//     }
//     // res.writeHead(200, { 'content-type': 'application/json' });
//     res.setHeader('Content-type', 'application/json');
//     res.statusCode = 201;
//     const resData = {
//       method,
//       url,
//       qs,
//     };
//     res.end(JSON.stringify(resData));
//   } else if (method === 'POST') {
//     console.log('content-type', headers['content-type']);
//     let postData = '';
//     req.on('data', chunk => {
//       console.log(chunk);
//       postData += chunk.toString();
//     });
//     req.on('end', () => {
//       console.log(postData, typeof postData);
//       res.end('full request received...');
//     });
//   }
// });

// server.listen(3000, () => {
//   console.log('server is up...');
// });

// const foo = new Promise((res, rej) => {
//   console.log(123);
//   // throw new Error('');
//   res();
// });

// const bar = async () => {
//   try {
//     const a = await foo;
//     console.log(a);
//   } catch (error) {
//     console.log(error);
//   }
// };

// bar();

// mysql
const mysql = require('mysql');
// create connection (config)
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Password4me_88',
  port: '3306',
  database: 'myblog',
});
// open connection
conn.connect();
// // execute sql
// let sql = "select * from blogs;";
// conn.query(sql, (error, result) => {
//   // console.log(result, typeof result);
//   // console.log(error, typeof error);
//   if (error) console.log('you got some errors...', typeof error, error);
//   else console.log(result);
// });

// sql = 'delete from blogs where id=7;';
// conn.query(sql, (error, result) => {
//   // console.log(result, typeof result);
//   // console.log(error, typeof error);
//   if (error) console.log('you got some errors...', typeof error, error);
//   else console.log(result);
// });

// sql = 'update users set username="Brucess" where id=3';
// conn.query(sql, (error, result) => {
//   if (error) console.log('you got some errors...', error);
//   else console.log(result);
// });

const a = undefined;
const sql = `insert into blogs(title, content, createtime, authorId) values ('123', '123123123123123123', UNIX_TIMESTAMP(NOW()), ${a});`;
conn.query(sql, (error, result) => {
  if (error) {
    console.log('you got some errors...', error);
    console.log(result);
  } else console.log(result);
});
// // close connection
// conn.end();

// const fs = require('fs');
// const path = require('path');

// fs.writeFile(
//   path.resolve(__dirname, '123.txt'),
//   'Hello World!',
//   function (err) {
//     if (err) {
//       return console.log(err);
//     }
//     console.log('File saved successfully!');
//   }
// );

// const foo = async () => {};

// console.log(foo());

// const p = new Promise((res, rej) => {
//   res(123);
//   console.log(456);
// });
// const http = require('http');
// const server = http.createServer((req, res) => {
//     res.writeHead(302, 'Temp redirect', {Location:'/login'})
// });

// const redis = require('redis');

// // create client
// const redisClient = redis.createClient();
// redisClient.on('error', (err) => {
//   console.log(err);
// });

// const useRedisClient = async () => {
//   await redisClient.connect();
//   // set and get key/value pair
//   await redisClient.set('foo', '123');
//   await redisClient.pExpireAt('foo', Date.now() + 10000);
//   const value = await redisClient.get('doo');
//   console.log(value);
// };
// useRedisClient();

// const test = (time = Date.now() + 1000) => {
//   console.log('inside func', Date.now() + 1000);
//   console.log('time', time);
// };

// test();

// redisClient.connect();
// redisClient.set('foo', '123');
// redisClient.get('foo', (err, val) => {
//   if (err) console.log(err);
//   else console.log(val);
// });
// redisClient.get('foo', (err, val) => {
//     if (err) console.log(err);
//     else console.log(val);

//     // quit
//     redisClient.quit();
//   });

// const foo = () => {
//   throw new Error('123');
// };

// try {
//   foo();
// } catch (error) {
//   console.log(error.message);
// }
