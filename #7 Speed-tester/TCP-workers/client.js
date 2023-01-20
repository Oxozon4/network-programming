const net = require('net');
const prompt = require('prompt');

const SERVER_HOST = '192.168.8.113';
let SERVER_PORT = 0007;

const getClientMessages = (client) => {
  prompt.get({ name: 'message', message: 'Enter message' }, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.message === 'quit') {
      client.end();
    }
    client.write(result.message);
    console.log(
      `INFO: Send bytes: ${Buffer.byteLength(result.message, 'utf-8')}`
    );
    getClientMessages(client);
  });
};

const client = net.connect(
  {
    port: SERVER_PORT,
    host: SERVER_HOST,
  },
  () => {
    setTimeout(getClientMessages.bind(this, client), 100);
  }
);

client.on('data', (data) => {
  const stringData = data.toString();
  console.log(stringData);
  if (stringData.includes('BUSY')) {
    console.log('lol');
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
