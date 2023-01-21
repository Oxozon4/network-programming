const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const multicastAddr = '230.185.192.108';

server.on('listening', () => {
  console.log(
    `Server - Discover (ip: ${multicastAddr} started listening on port: 7...`
  );
});

server.on('message', (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}`);

  // Send response message if the message received is "Are you a server?"
  if (msg.toString() === 'Are you a server?') {
    const response = Buffer.from('Yes, I am a server');
    server.send(response, rinfo.port, rinfo.address);
  }
});

server.bind(0007, () => {
  server.addMembership(multicastAddr);
});
