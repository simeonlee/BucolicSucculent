angular.module('app', [ui.router])

.config(function ($stateProvider, $urlRouterProvider)  {

    $urlRouterProvider.otherwise('/login'); // <-------------- default view

    $stateProvider
      .state('login', {
          url: '/login',
          templateUrl: '',
          controller: ''
        })
      .state('signup', {
        url: '/signup',
        templateUrl: '',
        controller: ''
      });
})