const express = require('express');
const app = express();
const net = require('net');

const server = net.createServer((socket) => {
  socket.write('Welcome new client!\n');
  console.log('Client connected!');

  socket.on('data', (data) => {
    console.log(data.toString());
  });

  socket.on('end', () => {
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    const { message } = error;
    socket.write(`An error occured: ${message}\n`);
    console.log(`An error occured: ${message}\n`);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(8080, () => {
  console.log('listening on *:8080');
});
