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
  let numberOfThreads = 10;
  const workersArray = [];

  for (let i = 1; i <= 10; i += 1) {
    const worker = new Worker('./program2.js', {
      workerData: {
        suspended: true,
        id: i === 10 ? 0 : i,
      },
    });
    worker.on('error', () => {
      console.log('Program 2: There has been an error with the threads!');
      process.exit();
    });
    worker.on('exit', () => {
      if (numberOfThreads === 1) {
        console.log('Program 2 has finished its operations!');
        process.exit();
      }
      numberOfThreads -= 1;
    });
    workersArray.push(worker);
  }

  prompt.get(
    {
      name: 'command',
      message: 'Enter command:',
    },
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (!result.command) {
        return;
      }
      const singleStopPattern = /\bstop \d/i;
      const multiStopPattern = /\bstop \d-\d/i;
      const singleStartPattern = /\bstart \d-\d/i;
      const MultiStartPattern = /\bstart \d-\d/i;

      if (multiStopPattern.test(result.command)) {
        const splittedPattern = result.command.split(' ')[1].split('-');
        const [firstNumber, secondNumber] = splittedPattern;
        if (firstNumber < secondNumber) {
          for (let i = firstNumber; i <= secondNumber; i++) {
            workersArray[i].postMessage({ type: 'suspend' });
          }
        }
      } else if (singleStopPattern.test(result.command)) {
        const splittedPattern = result.command.split(' ');
        workersArray[splittedPattern[1]].postMessage({ type: 'suspend' });
        console.log(
          `Program 2: Worker with id:${splittedPattern[1]} has been suspended!`
        );
      } else if (MultiStartPattern.test(result.command)) {
        const splittedPattern = result.command.split(' ')[1].split('-');
        const [firstNumber, secondNumber] = splittedPattern;
        if (firstNumber < secondNumber) {
          for (let i = firstNumber; i <= secondNumber; i++) {
            console.log(i);
            workersArray[i].postMessage({ type: 'resume' });
          }
        }
      } else if (singleStartPattern.test(result.command)) {
        const splittedPattern = result.command.split(' ');
        workersArray[splittedPattern[1]].postMessage({ type: 'resume' });
        console.log(
          `Program 2: Worker with id:${splittedPattern[1]} has been resumed!`
        );
      }
    }
  );
};
