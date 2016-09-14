var express = require('express');
var bodyParser = require('body-parser');
var http = require('http')

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server)

app.use(bodyParser.json());
app.use(express.static('./dist'));

var db = require('./config/db-config').db;

db.authenticate().then(function (err) {
 if (err) {
    console.log('sequelize authenticate ERROR');
 } else {
    console.log('Connection has been established successfully');
 }
});

/* IF YOU ARE WORKING WITH THIS CODE BASE FOR THE FIRST TIME, TO SET UP DATA BASE
MAKE SURE YOU ADD 'SCAVENGER' TO MY SQL DATABASE! THEN UNCOMMENT BELOW CODE TO FORCE
DATABASE UPDATE! RECOMMENT AFTER YOU USE 'NPM START' ONCE. THEN RESTART YOUR SERVER 
AFTER RECOMMENTING BELOW CODE. */
// db
//   .sync({ force: true })
//   .then(function(err) {
//     console.log('It worked!');
//   }, function (err) { 
//     console.log('An error occurred while creating the table:', err);
//   });


require('./config/router')(app, express);

var port = app.get('env') === 'development' ? 4200 : 80;

//socket connection
io.sockets.on('connection', require('./sockets/socketsConfig'));

server.listen(port, function () {
  console.log('Server listening on port ' + port +'!');
  db.sync().then(function() {
    // console.log('Synced with mySql');
  });
});

module.exports = server;
