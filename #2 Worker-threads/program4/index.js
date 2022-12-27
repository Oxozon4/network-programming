const prompt = require('prompt');
const { Worker } = require('worker_threads');

module.exports = {
  runFourthProgramThreads: () => {
    let numberOfThreads = 10;
    const workersArray = [];

    for (let i = 1; i <= 10; i += 1) {
      const worker = new Worker('./program4/worker.js', {
        workerData: {
          id: i === 10 ? 0 : i,
        },
      });
      worker.on('error', (msg) => {
        console.log('Program 4: There has been an error with the threads!');
        console.log(msg);
        process.exit();
      });
      worker.on('exit', () => {
        if (numberOfThreads === 1) {
          console.log('Program 4 has finished its operations!');
          process.exit();
        }
        numberOfThreads -= 1;
      });
      workersArray.push(worker);
    }

    getUserProgram4Command = () => {
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
          const singleDeletePattern = /\bdelete \d/i;
          const multiDeletePattern = /\bdelete \d-\d/i;

          if (multiDeletePattern.test(result.command)) {
            const splittedPattern = result.command.split(' ')[1].split('-');
            let [firstNumber, secondNumber] = splittedPattern;
            firstNumber -= 1;
            secondNumber -= 1;
            if (firstNumber < secondNumber) {
              for (let i = firstNumber; i <= secondNumber; i++) {
                workersArray[i].postMessage({ type: 'delete' });
                console.log(
                  `Program 4: Worker with id:${
                    Number(i) + 1
                  } has been suspended!`
                );
              }
            }
          } else if (singleDeletePattern.test(result.command)) {
            const splittedPattern = result.command.split(' ');
            workersArray[splittedPattern[1]].postMessage({ type: 'delete' });
            console.log(
              `Program 4: Worker with id:${
                Number(splittedPattern[1]) + 1
              } has been suspended!`
            );
          } else {
            console.log('Incorrect value!');
          }
          getUserProgram4Command();
        }
      );
    };
    getUserProgram4Command();
  },
};
