const prompt = require('prompt');
const { runFirstProgramThreads } = require('./program1');
const { runSecondProgramThreads } = require('./program2');
const { runThirdProgramThreads } = require('./program3');
const { runFourthProgramThreads } = require('./program4');

prompt.start();
prompt.get(
  {
    name: 'programNumber',
    validator: /^\d{1}$/,
    message: 'What program would you like to run? (1-4)',
    warning: 'Program must be a number in range 1-4!',
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
      runThirdProgramThreads();
      break;
    case 4:
      runFourthProgramThreads();
      break;
    default:
      break;
  }
};
