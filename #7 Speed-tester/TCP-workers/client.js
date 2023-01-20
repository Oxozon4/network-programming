const net = require('net');

const SERVER_HOST = '192.168.8.113';
let SERVER_PORT = 0007;

const getClientMessages = (client) => {
  console.log('message');
};

const client = net.connect(
  {
    port: SERVER_PORT,
    host: SERVER_HOST,
  },
  () => {
    client.setNoDelay(true);
    setTimeout(getClientMessages.bind(this, client), 100);
  }
);

client.on('data', (data) => {
  const stringData = data.toString();
  console.log(`Server TCP: ${stringData}`);
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
