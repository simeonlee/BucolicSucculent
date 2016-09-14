module.exports = function (socket) {
  console.log('connection made');

  socket.on('updateLocation', function(data){
    console.log(data);
    socket.broadcast.emit('updateLocation', data);
  })


  setInterval(function () {
    socket.emit('send:time', {
      time: (new Date()).toString()
    });
  }, 10000);
};