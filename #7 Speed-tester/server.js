const { Worker } = require('worker_threads');
const prompt = require('prompt');

const SERVER_HOST = '192.168.8.113';
let activeWorkers = 0;
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
    startServerTCPWorker();
    startServerUDPWorker();
    console.log('Server: All threads succesfully created!');
  }
);

const onWorkerExit = (workerName) => {
  console.log(`Server: ${workerName} worker finished its operations`);
  activeWorkers -= 1;
  if (activeWorkers <= 0) {
    console.log('Server: All workers finished its operations!');
    process.exit();
  }
};

const startServerTCPWorker = () => {
  const TCPWorker = new Worker('./TCP-workers/server', {
    workerData: {
      SERVER_HOST,
      SERVER_PORT,
    },
  });
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

const startServerUDPWorker = () => {
  const UDPWorker = new Worker('./UDP-workers/server.js', {
    workerData: {
      SERVER_HOST,
      SERVER_PORT,
    },
  });
  activeWorkers += 1;

  UDPWorker.on('exit', () => {
    console.log('UDP Worker: Finished all operations!');
    onWorkerExit('UDP');
  });
  UDPWorker.on('error', (msg) => {
    console.log('UDP Worker: There has been an error with the thread!', msg);
    onWorkerExit('UDP');
  });
};
