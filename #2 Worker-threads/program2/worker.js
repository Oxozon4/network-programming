const { workerData, parentPort } = require('worker_threads');

let suspended = false;
let i = 'a'.charCodeAt(0);

if (workerData.suspended) {
  suspended = true;
}

parentPort.on('message', (msg) => {
  if (msg.type === 'suspend') {
    suspended = true;
  } else if (msg.type === 'resume') {
    suspended = false;
  }
});

const workerProgram = () => {
  if (suspended) {
    return;
  }
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
