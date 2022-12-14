const net = require('net');
const prompt = require('prompt');

const SERVER_HOST = '192.168.8.113';
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

const startClient = () => {
  const client = net.connect(
    {
      port: SERVER_PORT,
      host: SERVER_HOST
    },
    () => {
      setTimeout(getClientMessages.bind(this, client), 100);
    }
  );

  client.on('data', (data) => {
    console.log(data.toString());
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
};
