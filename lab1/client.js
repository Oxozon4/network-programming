const net = require('net');
const prompt = require('prompt');
const readLine = require('readline').createInterface(
  process.stdin,
  process.stdout
);

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

const startClient = () => {
  const client = net.connect(
    {
      port: SERVER_PORT,
      host: '192.168.8.113',
    },
    () => {
      readLine.on('line', (data) => {
        client.write(data);
        if (data === 'quit') {
          client.end();
        }
        console.log(`INFO: Send bytes: ${Buffer.byteLength(data, 'utf-8')}`);
      });
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
    console.log(`An error occured on the server: ${message}\n`);
    process.exit();
  });
};
