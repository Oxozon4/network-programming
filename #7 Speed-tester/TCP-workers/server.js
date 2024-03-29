const net = require('net');
const { workerData, parentPort } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT } = workerData;

const maxConnections = 1;
let activeConnections = 0;
let receivedDataSize = 10;
let startTime;
let endTime;
const clients = [];

let finalStartTime;
let finalEndTime;
let PackagesSum = 0;

const server = net.createServer((socket) => {
  activeConnections += 1;
  if (activeConnections > maxConnections) {
    socket.write('BUSY\n');
  } else {
    finalStartTime = Date.now();
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
    endTime = Date.now();

    console.log(
      `Client TCP (PORT:${socket._peername?.port}): ${stringData} Received ${
        data.byteLength
      } bytes in ${new Date(
        endTime - startTime
      ).getSeconds()} seconds. Transfer speed: ${data.byteLength / 1024}kb/sec`
    );
    PackagesSum += data.byteLength;
    startTime = Date.now();
    finalEndTime = Date.now();
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
    const connectionTime = new Date(finalEndTime - finalStartTime).getSeconds();
    console.log(
      `TCP Statistics: Total time: ${connectionTime}s Total bytes: ${PackagesSum} Speed: ${(
        PackagesSum /
        connectionTime /
        1024
      ).toFixed(2)}Kb/s`
    );
    parentPort.postMessage({ message: 'End' });
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

server.listen({ port: SERVER_PORT }, () => {
  console.log(
    `Server - TCP (ip: ${SERVER_HOST}): Started listening on port: ${SERVER_PORT} ...`
  );
});
