
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps', 'app.services', 'app.game'])

.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider)  {

    $urlRouterProvider.otherwise('/login'); // <-------------- default view SET TO DASHBOARD!

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
                markers: [{"id":1,"coords":{"latitude":37.76922210201123,"longitude":-122.46047973632812},"options":{"label":"1","visible":true}},{"id":2,"coords":{"latitude":37.76392978442336,"longitude":-122.43318557739258},"options":{"label":"2","visible":true}},{"id":3,"coords":{"latitude":37.7897092979573,"longitude":-122.40589141845703},"options":{"label":"3","visible":true}}]
              }
            }

            // Requests.getGameData($stateParams.gameId)
          }
        }
      });


      //////////////////// 

      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDgVf-KYpLw0vF1kUlPK3eZc9clchmpRbM', //<----- configure map
        libraries: 'drawing,geometry,visualization'
    });
})