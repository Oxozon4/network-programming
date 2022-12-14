const { workerData } = require('worker_threads');

let i = 'a'.charCodeAt(0);
const interval = setInterval(() => {
  console.log(`${String.fromCharCode(i)}${workerData}`);
  if (String.fromCharCode(i) === 'z') {
    clearInterval(interval);
  }
  i++;
}, 1000);
