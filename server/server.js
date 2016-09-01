var express = require('express');
var app = express();

app.use(express.static('./client'));

app.get('/api/game', function (req, res) {
  res.send('Hello World! This is the game route.');
});

app.get('/api/game/map', function (req, res) {
  res.send('Hello World! This is the game map.');
});

app.listen(4200, function () {
  console.log('Example app listening on port 4200!');
});