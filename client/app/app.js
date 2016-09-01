
angular.module('app', ['ui.router', 'app.auth'])

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
      });
})