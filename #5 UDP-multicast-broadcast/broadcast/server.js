const dgram = require('dgram');
const prompt = require('prompt');

const SERVER_HOST = '192.168.8.113';
let SERVER_PORT = 0007;

prompt.start();
prompt.get(
  {
    name: 'port',
    validator: /^\d{4}$/,
    message: 'Enter port for the server (Press enter if 0007)',
    warning: 'Port must be a number containing 4 digits!',
  },
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.port) {
      SERVER_PORT = Number(result.port);
    }
    startServer();
  }
);

const getServerMessages = (server) => {
  prompt.get({ name: 'message', message: 'Enter message' }, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.message === 'quit') {
      server.end();
    }
    const message = Buffer.from(result.message);
    server.send(message, SERVER_PORT, SERVER_HOST, () => {
      if (err) {
        throw err;
      }
    });
    getServerMessages(server);
  });
};

const startServer = () => {
  const server = dgram.createSocket('udp4');
  server.bind(() => {
    server.setBroadcast(true);
    getServerMessages(server);
  });

  server.on('error', (e) => {
    console.log(`An error occured during creation of the server: ${e}`);
    console.log(
      `Are you sure that you have access to IP address: ${SERVER_HOST} ?`
    );
    process.exit();
  });
};
