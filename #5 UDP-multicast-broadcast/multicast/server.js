const dgram = require('dgram');
const prompt = require('prompt');
const ipAddressRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

let MULTICAST_ADDRESS = '192.168.8.113';
let SERVER_PORT = 0070;
let SRC_PORT = 0007;

prompt.get(
  {
    name: 'port',
    validator: /^\d{4}$/,
    message: 'Enter port for the server (Press enter if 0070)',
    warning: 'Port must be a number containing 4 digits!',
  },
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.port) {
      SERVER_PORT = Number(result.port);
    }
    getMulticastAddress();
  }
);

const getMulticastAddress = () => {
  prompt.get(
    {
      name: 'ip',
      validator: ipAddressRegex,
      message: 'Enter Multicast IP address for the server',
      warning: 'Incorrect IP address format!',
    },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (result.ip) {
        MULTICAST_ADDRESS = result.ip;
      }
      startServer();
    }
  );
};

const getServerMessages = (server) => {
  prompt.get({ name: 'message', message: 'Enter message' }, (err, result) => {
    if (err) {
      throw err;
    }
    if (result.message === 'quit') {
      server.end();
    }
    const message = Buffer.from(result.message);
    server.send(message, SERVER_PORT, MULTICAST_ADDRESS, () => {
      if (err) {
        throw err;
      }
    });
    getServerMessages(server);
  });
};

const startServer = () => {
  const server = dgram.createSocket('udp4');
  server.bind(SRC_PORT, () => {
    getServerMessages(server);
  });

  server.on('error', (e) => {
    console.log(`An error occured during creation of the server: ${e}`);
    console.log(
      `Are you sure that you have access to IP address: ${MULTICAST_ADDRESS} ?`
    );
    process.exit();
  });
};
