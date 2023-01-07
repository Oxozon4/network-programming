const express = require('express');
const path = require('path');
const app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.get('/index.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/index.js'));
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
