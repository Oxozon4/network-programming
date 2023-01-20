const net = require('net');
const { workerData, parentPort } = require('worker_threads');
const { SERVER_HOST, SERVER_PORT, isNagleAlgorithm, dataArray, dataSize } =
  workerData;

parentPort.on('message', (message) => {
  if (message.type === 'exit') {
    process.exit();
  }
});

const client = net.connect(
  {
    port: SERVER_PORT,
    host: SERVER_HOST,
  },
  () => {
    if (isNagleAlgorithm) {
      client.setNoDelay(true);
    }
    sendSizeMessage(client);
    const message = dataArray.toString();
    setInterval(sendClientMessages.bind(this, client, message), 1000);
  }
);

const sendSizeMessage = (client) => {
  client.write(`SIZE:${dataSize}`);
};

const sendClientMessages = (client, message) => {
  client.write(`${message}`);
};

client.on('data', (data) => {
  const stringData = data.toString();
  console.log(`Server TCP: ${stringData}`);
  if (stringData.includes('BUSY')) {
    client.end();
    process.exit();
  }
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
