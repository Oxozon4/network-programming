const net = require('net');

const SERVER_HOST = '192.168.8.113';
const maxConnections = 1;
let SERVER_PORT = 0007;
let activeConnections = 0;
let receivedDataSize = 10;
const clients = [];

const server = net.createServer((socket) => {
  activeConnections += 1;
  if (activeConnections > maxConnections) {
    socket.write('BUSY\n');
  } else {
    clients.push(socket);
    socket.write('Welcome new TCP client!\n');
    socket.write(`READY\n`);
    console.log('Client TCP connected!');
    console.log(`Client TCP address: ${socket.remoteAddress}`);
    console.log(`Client TCP port: ${socket.remotePort}`);
    console.log(`Client TCP IP4/IP6: ${socket.remoteFamily}`);
  }

  socket.on('data', (data) => {
    const stringData = data.toString();

    if (stringData.startsWith('SIZE:')) {
      receivedDataSize = Number(stringData.substring('5'));
    }

    console.log(
      `Client TCP (PORT:${socket._peername.port}): ${stringData} (INFO: Received Bytes: ${data.byteLength})`
    );
  });

  socket.on('end', () => {
    activeConnections -= 1;
    console.log('Client TCP disconnected');
  });

  socket.on('error', (error) => {
    const { message } = error;
    socket.write(`An error occured: ${message}\n`);
    console.log(`Server TCP: An error occured: ${message}\n`);
    activeConnections -= 1;
  });

  socket.on('close', () => {
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    activeConnections -= 1;
  });
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
    `Server - TCP (ip: ${SERVER_HOST}): Started listening on port: ${SERVER_PORT} ...`
  );
});
