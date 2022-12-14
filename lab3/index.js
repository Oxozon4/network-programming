const prompt = require('prompt');
const { Worker } = require('worker_threads');

prompt.start();
prompt.get(
  {
    name: 'programNumber',
    validator: /^\d{1}$/,
    message: 'What program would you like to run? (1-4)',
    warning: 'Port must be a number!',
  },
  (err, result) => {
    if (err) {
      return console.log(err);
    }
    if (result.programNumber) {
      runProgram(Number(result.programNumber));
    }
  }
);

const runProgram = (programNumber) => {
  switch (programNumber) {
    case 1:
      runFirstProgramThreads();
      break;
    case 2:
      runSecondProgramThreads();
      break;
    case 3:
    case 4:
    default:
      break;
  }
};

const runFirstProgramThreads = () => {
  const worker = new Worker('./program1.js');

  worker.on('exit', () => {
    console.log('Program 1 worker has finished its operations!');
    process.exit();
  });
  worker.on('error', () => {
    console.log('Program 1: There has been an error with the thread!');
    process.exit();
  });
};

const runSecondProgramThreads = () => {
  for (let i = 1; i <= 10; i += 1) {
    const worker = new Worker('./program2.js', {
      workerData: i === 10 ? 0 : i,
    });
    worker.on('error', () => {
      console.log('Program 2: There has been an error with the threads!');
      process.exit();
    });
  }
};
