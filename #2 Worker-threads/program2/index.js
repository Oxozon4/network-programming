const prompt = require('prompt');
const { Worker } = require('worker_threads');

module.exports = {
  runSecondProgramThreads: () => {
    let numberOfThreads = 10;
    const workersArray = [];

    for (let i = 1; i <= 10; i += 1) {
      const worker = new Worker('./program2/worker.js', {
        workerData: {
          suspended: true,
          id: i === 10 ? 0 : i,
        },
      });
      worker.on('error', (msg) => {
        console.log('Program 2: There has been an error with the threads!');
        console.log(msg);
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

    getUserProgram2Command = () => {
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
          const singleStartPattern = /\bstart \d/i;
          const MultiStartPattern = /\bstart \d-\d/i;

          if (multiStopPattern.test(result.command)) {
            const splittedPattern = result.command.split(' ')[1].split('-');
            let [firstNumber, secondNumber] = splittedPattern;
            firstNumber -= 1;
            secondNumber -= 1;
            if (firstNumber < secondNumber) {
              for (let i = firstNumber; i <= secondNumber; i++) {
                workersArray[i].postMessage({ type: 'suspend' });
                console.log(
                  `Program 2: Worker with id:${
                    Number(i) + 1
                  } has been suspended!`
                );
              }
            }
          } else if (singleStopPattern.test(result.command)) {
            const splittedPattern = result.command.split(' ');
            workersArray[splittedPattern[1]].postMessage({ type: 'suspend' });
            console.log(
              `Program 2: Worker with id:${
                Number(splittedPattern[1]) + 1
              } has been suspended!`
            );
          } else if (MultiStartPattern.test(result.command)) {
            const splittedPattern = result.command.split(' ')[1].split('-');
            let [firstNumber, secondNumber] = splittedPattern;
            firstNumber -= 1;
            secondNumber -= 1;
            if (firstNumber < secondNumber) {
              for (let i = firstNumber; i <= secondNumber; i++) {
                workersArray[i].postMessage({ type: 'resume' });
                console.log(
                  `Program 2: Worker with id:${Number(i) + 1} has been resumed!`
                );
              }
            }
          } else if (singleStartPattern.test(result.command)) {
            const splittedPattern = result.command.split(' ');
            workersArray[splittedPattern[1]].postMessage({ type: 'resume' });
            console.log(
              `Program 2: Worker with id:${
                Number(splittedPattern[1]) + 1
              } has been resumed!`
            );
          } else {
            console.log('Incorrect value!');
          }
          getUserProgram2Command();
        }
      );
    };
    getUserProgram2Command();
  },
};
