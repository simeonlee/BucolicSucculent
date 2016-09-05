
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps', 'app.services', 'app.game'])

.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider)  {

    $urlRouterProvider.otherwise('/login'); // <-------------- default view TODO: SET TO DASHBOARD!

    $stateProvider
      .state('login', {
          url: '/login',
          templateUrl: '../views/login.html',
          controller: 'AuthController'
        })
      .state('signup', {
        url: '/signup',
        templateUrl: '../views/signup.html',
        controller: 'AuthController'
      })
      .state('createGame', {
        url: '/createGame',
        templateUrl: '../views/createGame.html',
        controller: 'createGameController'
      })
      .state('game', {
        url: '/game/:gameId',
        templateUrl: '../views/game.html',
        controller: 'gameController',
        resolve: {
          data: function($stateParams) {
            return {
              map: { 
                center: { 
                  latitude: 37.7836881,                 //<------- dummy data
                  longitude: -122.40904010000001 
                }, 
                zoom: 13,
                markers: [{"id":1,"coords":{"latitude":37.76922210201123,"longitude":-122.46047973632812}},{"id":2,"coords":{"latitude":37.76392978442336,"longitude":-122.43318557739258}},{"id":3,"coords":{"latitude":37.7897092979573,"longitude":-122.40589141845703}}]
              },
              players: [{"name": 'Brian', "locations": [{"id": 1, "status": true},{"id": 2, "status": false},{"id": 3, "status": false}]}, {"name": 'Clara', "locations": [{"id": 1, "status": false},{"id": 2, "status": true},{"id": 3, "status": true}]}]
            }

            // Requests.getGameData($stateParams.gameId) <----- turn on get request once server is ready
          }
        }
      })
      .state('game.map', { //child view of game view ---- link to here on game join
        url: '/map',
        templateUrl: '../views/game.map.html',
        controller: 'gameMapController'
      })
      .state('game.stats', { //child view of game view
        url: '/stats',
        templateUrl: '../views/game.stats.html',
        controller: 'gameStatsController'
      });


      //////////////////// 

      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDgVf-KYpLw0vF1kUlPK3eZc9clchmpRbM', //<----- configure map... should live serverside
        libraries: 'drawing,geometry,visualization'
    });
})