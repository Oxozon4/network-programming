const dgram = require('dgram');
const { workerData } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT } = workerData;

const server = dgram.createSocket('udp4');
let regex = /Control Sum: (\d+)/;
let match;
let packetsReceived = 0;
let packetsExpected = 0;
let controlSum = 0;

server.on('listening', () => {
  const address = server.address();
  console.log(
    `Server - UDP (ip: ${address.address}): Started listening on port: ${address.port} ...`
  );
});

server.on('message', (msg, rinfo) => {
  if (msg === 'FINE') {
    console.log('fine');
    process.exit();
  }
  match = msg.toString().match(regex);
  if (match[1]) {
    packetsReceived++;
    controlSum = parseInt(match[1]);
    if (packetsReceived !== packetsExpected) {
      console.log(
        `UDP Packet loss detected. Expected ${packetsExpected}, received ${packetsReceived}`
      );
    }
    packetsExpected++;
  }

  console.log(
    `Client UDP (Address: ${rinfo.address}, PORT:${rinfo.port}): ${msg} (INFO: Received Bytes: ${rinfo.size})`
  );
});

server.on('error', (e) => {
  console.log(
    `Server UDP: An error occured during creation of the server: ${e}`
  );
  console.log(
    `Server UDP: Are you sure that you have access to IP address: ${SERVER_HOST} ?`
  );
  process.exit();
});

server.bind(SERVER_PORT, SERVER_HOST);
