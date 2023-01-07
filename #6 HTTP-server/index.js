const express = require('express');
const path = require('path');
const app = express();

app.get('*.js', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/index.js'));
});

app.get('/Storage1.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/Storage1.txt'));
});
app.get('/Storage2.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/Storage2.txt'));
});
app.get('/Storage3.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/Storage3.txt'));
});
app.get('/Storage4.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/Storage4.txt'));
});
app.get('/Storage5.txt', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'data/Storage5.txt'));
});

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/index.html'));
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
