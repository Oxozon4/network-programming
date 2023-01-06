const net = require('net');
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
  const server = net.createServer((socket) => {
    socket.write('Server: Welcome new client!\n');
    console.log('Client connected!');

    socket.on('data', (data) => {
      console.log(
        `Client: ${data.toString()} (INFO: Received Bytes: ${data.byteLength})`
      );
    });

    socket.on('end', () => {
      console.log('Client disconnected');
    });

    socket.on('error', (error) => {
      const { message } = error;
      socket.write(`Server: An error occured: ${message}\n`);
      console.log(`An error occured: ${message}\n`);
      process.exit();
    });
    console.log(`Server address: ${server.address().address}`);
  });

  server.on('error', (e) => {
    console.log(`An error occured during creation of the server: ${e}`);
    console.log(
      `Are you sure that you have access to IP address: ${SERVER_HOST} ?`
    );
    process.exit();
  });

  server.maxConnections = 1;

  server.listen({ port: SERVER_PORT, host: SERVER_HOST }, () => {
    console.log(
      `Server (ip: ${SERVER_HOST}): Started listening on port: ${SERVER_PORT} ...`
    );
  });
};
