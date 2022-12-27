const { Worker } = require('worker_threads');

module.exports = {
  runFirstProgramThreads: () => {
    const worker = new Worker('./program1/worker.js');

    worker.on('exit', () => {
      console.log('Program 1 worker has finished its operations!');
      process.exit();
    });
    worker.on('error', (msg) => {
      console.log('Program 1: There has been an error with the thread!', msg);
      process.exit();
    });
  },
};
