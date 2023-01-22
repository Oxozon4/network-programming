const dgram = require('dgram');
const { workerData, parentPort } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT, dataArray, dataSize } = workerData;
let controlSum = 0;

const client = dgram.createSocket('udp4');

const sendClientMessages = (client, message) => {
  controlSum += 1;
  client.send(
    `${message} Control Sum: ${controlSum}`,
    SERVER_PORT,
    SERVER_HOST
  );
};

parentPort.on('message', (message) => {
  if (message.type === 'exit') {
    client.send('FINE', SERVER_PORT, SERVER_HOST);
    process.exit();
  }
});

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
