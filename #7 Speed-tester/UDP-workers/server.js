const dgram = require('dgram');
const SERVER_HOST = '192.168.8.113';
let SERVER_PORT = 0007;

const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(
    `Server - UDP (ip: ${address.address}): Started listening on port: ${address.port} ...`
  );
});

server.on('message', (msg, rinfo) => {
  console.log(
    `Client UDP (Address: ${rinfo.address}, PORT:${rinfo.port}): ${msg} (INFO: Received Bytes: ${rinfo.size})`
  );
  if (msg === 'FINE') {
    console.log('fine');
    process.exit();
  }
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
