
angular.module('app', ['ui.router', 'app.auth', 'app.createGame', 'uiGmapgoogle-maps', 'app.services', 'app.game', 'app.dashboard'])


.config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider, $httpProvider)  {

    $urlRouterProvider.otherwise('/dashboard'); // <-------------- default view TODO: SET TO DASHBOARD!

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
        controller: 'createGameController',
        resolve: {
          isAuth: function(Auth) {
            return Auth.isAuth();
          }
        }
      })
      .state('game', {
        url: '/game/:path',
        templateUrl: '../views/game.html',
        controller: 'gameController',
        resolve: {
          isAuth: function(Auth) {
            return Auth.isAuth();
          }
        }
      })
      .state('game.map', { //child view of game view ---- link to here on game join
        url: '/map',
        templateUrl: '../views/game.map.html',
        controller: 'gameMapController',
        resolve: {
          data: function($stateParams, Requests, Auth) {
            //Only fetch for gamedata if logged in
            if(!Auth.isAuth()) {
              return [];
            }
            return Requests.getGameData($stateParams.path).then(function(res) {
              console.log(res.data);
              return res.data.locations;
            }); 
          }
        }
      })
      .state('game.stats', { //child view of game view
        url: '/stats',
        templateUrl: '../views/game.stats.html',
        controller: 'gameStatsController', 
        resolve: {
          data: function($stateParams, Requests, Auth) {
            //Only fetch for gamedata if logged in
            if(!Auth.isAuth()) {
              return [];
            }
            return Requests.getGameStats($stateParams.path).then(function(res) {
              console.log(res.data);
              return res.data;
            }); 
          }
        }
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: '../views/dashboard.html',
        controller: 'dashboardController',
        resolve: {
          isAuth: function(Auth) {
            return Auth.isAuth();
          },
          data: function(Requests, Auth) {
            //Only fetch for data if logged in
            if(!Auth.isAuth()) {
              return [];
            }
            return Requests.getUserData().then(function(res) {
              console.log(res.data, 'dashboard data');
              return res.data;
            }); 
          }
        }
      });


      //////////////////// 

      uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyDgVf-KYpLw0vF1kUlPK3eZc9clchmpRbM', //<----- apiKey restricted!
        libraries: 'drawing,geometry,visualization'
    });
}])
.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
  $rootScope.signOut = function() {
    Auth.signout();
  };
  // here inside the run phase of angular, our services and controllers
  // have just been registered and our app is ready
  // however, we want to make sure the user is authorized
  // we listen for when angular is trying to change routes
  // when it does change routes, we then look for the token in localstorage
  // and send that token to the server to see if it is a real user or hasn't expired
  // if it's not valid, we then redirect back to signin/signup
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      console.log('routchangeredirect');
      $location.path('/login');
    }
  });
}]);
