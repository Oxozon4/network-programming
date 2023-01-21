const dgram = require('dgram');
const client = dgram.createSocket('udp4');

// Multicast IP address to discover servers
const multicastAddr = '230.185.192.108';
client.bind(() => {
  client.setBroadcast(true);
  client.setMulticastTTL(128);
  client.addMembership(multicastAddr);
});

// Send message to multicast address
client.send('Are you a server?', 0007, multicastAddr, (err, bytes) => {
  if (err) {
    console.log(`Error sending message: ${err}`);
  } else {
    console.log(`Sent Multicast message to ${multicastAddr}:0007`);
  }
});

client.on('message', (msg, rinfo) => {
  console.log(`Server found at ${rinfo.address}:${rinfo.port}`);
});
