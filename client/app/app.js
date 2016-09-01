
angular.module('app', ['ui.router', 'app.auth', 'app.createGame'])

.config(function ($stateProvider, $urlRouterProvider)  {

    $urlRouterProvider.otherwise('/login'); // <-------------- default view

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
      });
})