const { Worker } = require('worker_threads');
const prompt = require('prompt');

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
    startServerTCPWorker();
    // startServerUDPWorker();
  }
);

const startServerTCPWorker = () => {
  const TCPWorker = new Worker('./TCP-workers/server');

  TCPWorker.on('exit', () => {
    console.log('TCP Worker: Finished all operations!');
    process.exit();
  });
  TCPWorker.on('error', (msg) => {
    console.log('TCP Worker: There has been an error with the thread!', msg);
    process.exit();
  });
};

const startServerUDPWorker = () => {
  const UDPWorker = new Worker('./UDP-workers/server.js');

  UDPWorker.on('exit', () => {
    console.log('UDP Worker: Finished all operations!');
    process.exit();
  });
  UDPWorker.on('error', (msg) => {
    console.log('UDP Worker: There has been an error with the thread!', msg);
    process.exit();
  });
};
