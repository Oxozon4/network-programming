const dgram = require('dgram');
const SERVER_HOST = '192.168.8.113';
let SERVER_PORT = 0007;

const client = dgram.createSocket('udp4');

console.log('udp message');

client.on('message', (msg, rinfo) => {
  console.log(`\nServer UDP: ${msg.toString()}`);
});

client.on('end', () => {
  console.log('Disconnected from the server');
  process.exit();
});

client.on('error', (error) => {
  const { message } = error;
  console.log(`An error occured: ${message}\n`);
  process.exit();
});
