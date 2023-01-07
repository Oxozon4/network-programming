const express = require('express');
const path = require('path');
const app = express();

app.get('*.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/index.js'));
});

for (let i = 1; i <= 5; i++) {
  app.get(`/Storage${i}.txt`, (req, res) => {
    res.sendFile(path.resolve(__dirname, `data/Storage${i}.txt`));
  });
}

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
