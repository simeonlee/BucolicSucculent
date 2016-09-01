module.exports = function(app, express) {

  app.get('/api/game', function (req, res) {
    res.send('Hello World! This is the game route.');
  }
);

  app.get('/api/game/map', function (req, res) {
    res.send('Hello World! This is the game map.');
  });

};