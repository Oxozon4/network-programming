const dgram = require('dgram');
const { workerData, parentPort } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT, dataArray, dataSize } = workerData;

const client = dgram.createSocket('udp4');

const sendClientMessages = (client, message) => {
  client.send(message, SERVER_PORT, SERVER_HOST);
};

parentPort.on('message', (message) => {
  if (message.type === 'exit') {
    client.send('FINE', SERVER_PORT, SERVER_HOST);
    process.exit();
  }
});

setInterval(sendClientMessages.bind(this, client, dataArray.toString()), 1000);

client.on('message', (msg, rinfo) => {
  // if (msg.toString() === 'BUSY') {
  //   process.exit();
  // }
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
