const dgram = require('dgram');
const prompt = require('prompt');

let SERVER_PORT = 0007;

prompt.start();
prompt.get(
  {
    name: 'port',
    validator: /^\d{4}$/,
    message: 'Enter port of the server (Press enter if 0007)',
    warning: 'Port must be a number containing 4 digits!',
  },
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.port) {
      SERVER_PORT = Number(result.port);
    }
    startClient();
  }
);
prompt.emit('stop');

const startClient = () => {
  const client = dgram.createSocket('udp4');

  client.on('message', (msg, rinfo) => {
    console.log(`\nServer: ${msg.toString()}`);
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

  client.bind(SERVER_PORT);
};
