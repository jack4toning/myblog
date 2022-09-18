const http = require('http');
const requestHandler = require('../app');

const server = http.createServer(requestHandler);

server.listen(3000, () => {
  console.log('server is up...');
});

server.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.on('error', (err, socket) => {
  socket.end('HTTP/1.1 500 Server Error\r\n\r\n');
});
