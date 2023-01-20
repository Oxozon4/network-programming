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

const startServer = () => {
  const server = dgram.createSocket('udp4');

  server.on('listening', () => {
    const address = server.address();
    console.log(
      `Server (Address: ${address.address}): Started listening on port: ${address.port} ...`
    );
  });

  server.on('message', (msg, rinfo) => {
    console.log(
      `Client (Address: ${rinfo.address}, PORT:${rinfo.port}): ${msg} (INFO: Received Bytes: ${rinfo.size})`
    );
    const message = Buffer.from(msg);

    server.send(message, rinfo.port, rinfo.address, (error) => {
      if (error) {
        console.error(error);
        server.close();
      }
    });
  });

  server.on('error', (e) => {
    console.log(`An error occured during creation of the server: ${e}`);
    console.log(
      `Are you sure that you have access to IP address: ${SERVER_HOST} ?`
    );
    process.exit();
  });

  server.bind(SERVER_PORT, SERVER_HOST);
};
