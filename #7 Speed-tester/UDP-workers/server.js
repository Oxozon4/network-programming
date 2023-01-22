const dgram = require('dgram');
const { workerData, parentPort } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT } = workerData;

const server = dgram.createSocket('udp4');
let regex = /Control Sum: (\d+)/;
let match;

let packetsReceived = 0;
let packetsExpected = 0;
let controlSum = 0;

let isFirstMessage = true;

let finalStartTime;
let finalEndTime;
let PackagesSum = 0;

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
    if (packetsReceived < packetsExpected) {
      console.log(
        `UDP Packet loss detected. Expected ${packetsExpected}, received ${packetsReceived}`
      );
    }
    packetsExpected++;
  }
  if (isFirstMessage) {
    isFirstMessage = false;
    finalStartTime = Date.now();
  }

  console.log(
    `Client UDP (Address: ${rinfo.address}, PORT:${rinfo.port}): ${msg} (INFO: Received Bytes: ${rinfo.size})`
  );
  PackagesSum += rinfo.size;
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

parentPort.on('message', () => {
  finalEndTime = Date.now();
  const connectionTime = new Date(finalEndTime - finalStartTime).getSeconds();
  console.log(
    `UDP Statistics: Total time: ${connectionTime}s Total bytes: ${PackagesSum} Speed: ${(
      PackagesSum /
      connectionTime /
      1024
    ).toFixed(2)}Kb/s`
  );
  PackagesSum = 0;
  isFirstMessage = true;
});

server.bind(SERVER_PORT, SERVER_HOST);
