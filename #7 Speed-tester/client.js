const { Worker } = require('worker_threads');
const prompt = require('prompt');

const ipAddressRegex =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
let SERVER_HOST = '10.128.103.165';
let SERVER_PORT = 0007;
let dataSize = 10;
let isNagleAlgorithm = true;
let activeWorkers = 0;
const dataArray = [];
let isDestroyed = false;

let UDPWorker;
let TCPWorker;

prompt.start();
prompt.get(
  {
    name: 'ip',
    validator: ipAddressRegex,
    message: 'Enter IP address of the server (Press enter if 192.168.8.113)',
    warning: 'Incorrect IP address format!',
  },
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.ip) {
      SERVER_HOST = result.ip;
    }
    getServerPort();
  }
);

const getServerPort = () => {
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
      getDataSize();
    }
  );
};

const getDataSize = () => {
  prompt.get(
    {
      name: 'dataSize',
      validator: /\d+/,
      message: 'Enter size of data packages (Press enter if 10)',
      warning: 'Data size must be a number',
    },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (result.dataSize) {
        dataSize = Number(result.dataSize);
      }
      getNagleFlag();
    }
  );
};

const getNagleFlag = () => {
  prompt.get(
    {
      name: 'nagleFlag',
      validator: /[yYnN]/,
      message: 'Would you like to use Nagle algorithm? (Y/N)',
      warning: 'Answer must be either Y or N!',
    },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (result.nagleFlag === 'N' || result.nagleFlag === 'n') {
        isNagleAlgorithm = false;
      }
      fillDataArray();
      startClientTCPWorker();
      startClientUDPWorker();
      console.log('Sending data...');
      getUserExitMessage();
      prompt.emit('stop');
    }
  );
};

const fillDataArray = () => {
  let i = 1;
  while (i <= dataSize) {
    dataArray.push(i);
    i += 1;
  }
};

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
  TCPWorker = new Worker('./TCP-workers/client', {
    workerData: {
      SERVER_HOST,
      SERVER_PORT,
      isNagleAlgorithm,
      dataArray,
      dataSize,
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

const startClientUDPWorker = () => {
  UDPWorker = new Worker('./UDP-workers/client', {
    workerData: {
      SERVER_HOST,
      SERVER_PORT,
      isNagleAlgorithm,
      dataArray,
      dataSize,
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

getUserExitMessage = () => {
  prompt.get(
    {
      name: 'exit',
      message: 'Press enter if you would like to stop the transmission',
    },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      TCPWorker.postMessage({ type: 'exit', data: { message: 'exit' } });
      UDPWorker.postMessage({ type: 'exit', data: { message: 'exit' } });
      console.log('Ending transmission..');
    }
  );
};
