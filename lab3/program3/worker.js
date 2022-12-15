const { workerData } = require('worker_threads');

let i = 'a'.charCodeAt(0);

const workerProgram = () => {
  console.log(`${String.fromCharCode(i)}${workerData.id}`);
  if (String.fromCharCode(i) === 'z') {
    console.log(
      `Worker with id: ${workerData.id} has finished its operations!\n`
    );
    process.exit();
  }
  i++;
};

setInterval(() => {
  workerProgram();
}, 1000);
