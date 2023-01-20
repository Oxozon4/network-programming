const dgram = require('dgram');
const { workerData } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT, dataArray, dataSize } = workerData;

const client = dgram.createSocket('udp4');

const sendClientMessages = (client, message) => {
  client.send(message, SERVER_PORT, SERVER_HOST);
};

setInterval(sendClientMessages.bind(this, client, dataArray.toString()), 1000);

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
