const { Worker } = require('worker_threads');

module.exports = {
  runThirdProgramThreads: () => {
    let numberOfThreads = 10;
    const workersArray = [];

    for (let i = 1; i <= 10; i += 1) {
      const worker = new Worker('./program3/worker.js', {
        workerData: {
          suspended: true,
          id: i === 10 ? 0 : i,
        },
      });
      worker.on('error', (msg) => {
        console.log('Program 3: There has been an error with the threads!');
        console.log(msg);
        process.exit();
      });
      worker.on('exit', () => {
        if (numberOfThreads === 1) {
          console.log('Program 3 has finished its operations!');
          process.exit();
        }
        numberOfThreads -= 1;
      });
      workersArray.push(worker);
    }
  },
};
