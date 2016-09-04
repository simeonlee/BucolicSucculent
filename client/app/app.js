
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps', 'app.services'])

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
        templateUrl: '',
        controller: '',
        resolve: {
          data: function($stateParams) {
            Requests.getGameData($stateParams.gameId)
          }
        }
      });


      //////////////////// 

      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDgVf-KYpLw0vF1kUlPK3eZc9clchmpRbM', //<----- configure map
        libraries: 'drawing,geometry,visualization'
    });
})