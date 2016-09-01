var express = require('express');
var app = express();

require('./config/router')(app, express);

app.use(express.static('./client'));

app.listen(4200, function () {
  console.log('Example app listening on port 4200!');
});