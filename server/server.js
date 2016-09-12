var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static('./dist'));

var db = require('./config/db-config').db;
require('./config/router')(app, express);

var port = app.get('env') === 'development' ? 4200 : 80;


app.listen(port, function () {
  console.log('Server listening on port ' + port +'!');
  db.sync().then(function() {
    // console.log('Synced with mySql');
  });
});

module.exports = app;
