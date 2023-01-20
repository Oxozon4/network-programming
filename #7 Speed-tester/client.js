const { Worker } = require('worker_threads');
const prompt = require('prompt');

const SERVER_HOST = '192.168.8.113';
let SERVER_PORT = 0007;
let activeWorkers = 0;

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
    startClientTCPWorker();
    startClientUDPWorker();
  }
);
prompt.emit('stop');

const onWorkerExit = (workerName) => {
  console.log(`Client: ${workerName} worker finished its operations`);
  activeWorkers -= 1;
  if (activeWorkers <= 0) {
    console.log(
      'Client: All workers finished its operations!\nExiting program...'
    );
    process.exit();
  }
};

const startClientTCPWorker = () => {
  const TCPWorker = new Worker('./TCP-workers/client');
  activeWorkers += 1;

  TCPWorker.on('exit', () => {
    console.log('TCP Worker: Finished all operations!');
    onWorkerExit('TCP');
  });
  TCPWorker.on('error', (msg) => {
    console.log('TCP Worker: There has been an error with the thread!', msg);
    onWorkerExit('TCP');
  });
};

const startClientUDPWorker = () => {
  const UDPWorker = new Worker('./UDP-workers/client');

  UDPWorker.on('exit', () => {
    console.log('UDP Worker: Finished all operations!');
    onWorkerExit('UDP');
  });
  UDPWorker.on('error', (msg) => {
    console.log('UDP Worker: There has been an error with the thread!', msg);
    onWorkerExit('UDP');
  });
};
