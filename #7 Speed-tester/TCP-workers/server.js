const net = require('net');

const SERVER_HOST = '192.168.8.113';
const MAX_CONNECTIONS = 1;
let SERVER_PORT = 0007;
let ACTIVE_CONNECTIONS = 0;
const clients = [];

const server = net.createServer((socket) => {
  ACTIVE_CONNECTIONS += 1;
  if (ACTIVE_CONNECTIONS > MAX_CONNECTIONS) {
    socket.write('Server: BUSY\n');
  } else {
    clients.push(socket);
    socket.write('Server: Welcome new client!\n');
    socket.write(`Server: READY\n`);
    console.log('Client connected!');
    console.log(`Client address: ${socket.remoteAddress}`);
    console.log(`Client port: ${socket.remotePort}`);
    console.log(`Client IP4/IP6: ${socket.remoteFamily}`);
  }

  socket.on('data', (data) => {
    console.log(
      `Client (PORT:${
        socket._peername.port
      }): ${data.toString()} (INFO: Received Bytes: ${data.byteLength})`
    );
    clients.forEach((client) => {
      if (client !== socket) {
        client.write(
          `\nClient (IP: ${socket._peername.address}, Port: ${socket._peername.port}): ${data}`
        );
      }
    });
  });

  socket.on('end', () => {
    ACTIVE_CONNECTIONS -= 1;
    console.log('Client disconnected');
  });

  socket.on('error', (error) => {
    const { message } = error;
    socket.write(`Server: An error occured: ${message}\n`);
    console.log(`An error occured: ${message}\n`);
    process.exit();
  });

  socket.on('close', () => {
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    ACTIVE_CONNECTIONS -= 1;
  });
  console.log(`Server address: ${server.address().address}\n`);
});

server.on('error', (e) => {
  if (e.message === 'Too many connections') {
    return;
  }
  console.log(`An error occured during creation of the server: ${e}`);
  console.log(
    `Are you sure that you have access to IP address: ${SERVER_HOST} ?`
  );
  process.exit();
});

server.listen({ port: SERVER_PORT, host: SERVER_HOST }, () => {
  console.log(
    `Server (ip: ${SERVER_HOST}): Started listening on port: ${SERVER_PORT} ...`
  );
});
