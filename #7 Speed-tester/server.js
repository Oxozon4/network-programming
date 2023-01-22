const { Worker } = require('worker_threads');
const prompt = require('prompt');

const SERVER_HOST = '192.168.56.1';
let activeWorkers = 0;
let SERVER_PORT = 0007;

let DiscoverWorker;
let TCPWorker;
let UDPWorker;

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
    startServerDiscoverWorker();
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

const startServerDiscoverWorker = () => {
  DiscoverWorker = new Worker('./UDP-workers/server-discover');
  DiscoverWorker.on('exit', () => {
    console.log('Discover Worker: Finished all operations!');
  });
  DiscoverWorker.on('error', (msg) => {
    console.log(
      'Discover Worker: There has been an error with the thread!',
      msg
    );
  });
};

const startServerTCPWorker = () => {
  TCPWorker = new Worker('./TCP-workers/server', {
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
  TCPWorker.on('message', () => {
    if (UDPWorker) {
      UDPWorker.postMessage('End');
    } else {
      console.log('UDP not initialized');
    }
  });
};

const startServerUDPWorker = () => {
  UDPWorker = new Worker('./UDP-workers/server.js', {
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
