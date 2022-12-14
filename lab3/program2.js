const { workerData } = require('worker_threads');

let suspended = false;

if (workerData.suspended) {
  suspended = true;
}

process.on('message', (msg) => {
  if (msg.type === 'suspend') {
    suspended = true;
  } else if (msg.type === 'resume') {
    console.log('resumed!');
    suspended = false;
  }
});

const workerProgram = () => {
  if (suspended) {
    return;
  }
  let i = 'a'.charCodeAt(0);
  const interval = setInterval(() => {
    console.log(`${String.fromCharCode(i)}${workerData.id}`);
    if (String.fromCharCode(i) === 'z') {
      clearInterval(interval);
    }
    i++;
  }, 1000);
};

setInterval(workerProgram, 1000);
