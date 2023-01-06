const dgram = require('dgram');
const prompt = require('prompt');
const ipAddressRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

let SERVER_PORT = 0070;
let SERVER_ADDRESS = '192.168.8.113';

prompt.start();
prompt.get(
  {
    name: 'port',
    validator: /^\d{4}$/,
    message: 'Enter port of the server (Press enter if 0070)',
    warning: 'Port must be a number containing 4 digits!',
  },
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.port) {
      SERVER_PORT = Number(result.port);
    }
    getServerAddress();
  }
);

const getServerAddress = () => {
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
        SERVER_ADDRESS = result.ip;
      }
      startClient();
    }
  );
};

const startClient = () => {
  const client = dgram.createSocket('udp4');

  client.on('message', (msg, rinfo) => {
    console.log(
      `\nServer: ${msg.toString()} (IP: ${rinfo.address}, Port: ${rinfo.port})`
    );
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

  client.bind(SERVER_PORT, () => {
    client.addMembership(SERVER_ADDRESS);
  });
};
