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
    case 2:
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
};
