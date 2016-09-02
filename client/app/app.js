
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps'])

.config(function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider)  {

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


      //////////////////// 

      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDgVf-KYpLw0vF1kUlPK3eZc9clchmpRbM',
        libraries: 'drawing,geometry,visualization'
    });
})