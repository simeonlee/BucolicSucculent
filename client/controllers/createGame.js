angular.module('app.createGame', ['uiGmapgoogle-maps', 'app.services', 'app'])

.controller('createGameController', ['Map', '$scope', 'uiGmapGoogleMapApi', 'Requests', '$rootScope', '$window', 'isAuth', '$location', '$compile', function(Map, $scope, uiGmapGoogleMapApi, Requests, $rootScope, $window, isAuth, $location, $compile) {

  var transparent = './images/marker/falseMarker/transparent-200x350.png';

  //check for JWT
  if (!isAuth) {
    $location.path('/login');
  }

  $scope.markers = [];

  Map.initialize().then(function(map) {
    $scope.map = map;
    Map.initializeMarkerLayer($scope.map);
    $scope.center = Map.getCenter($scope.map);
    $scope.map.addListener('click', function(e) {
      $scope.map.setCenter({
        lat: e.latLng.lat() + 0.00075,
        lng: e.latLng.lng()
      });
      $scope.map.setZoom(18);
      Map.findNearbyPlaces(e.latLng, $scope.map).then(function(places) {
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          console.log($scope.markers.length, place);
          var marker = Map.createDestination(place, $scope.markers.length.toString(), $scope.map)
          $scope.markers.push(marker);
        }
      });
    });
  });

  



















/*  var transparent = './images/marker/falseMarker/transparent-200x350.png';

  $scope.showMap = true;

  $scope.map = {
    // Default San Francisco
    center: {
      latitude: 37.7836881,                 
      longitude: -122.4090401 
    },
    zoom: 14,
    bounds: {},
    events: {
      tilesloaded: function (map, eventName, originalEventArgs) {
        // Once map is loaded and ready, this callback is hit
      },
      click: function (mapModel, eventName, originalEventArgs) {
        var e = originalEventArgs[0];
        $scope.findNearbyPlaces(e.latLng);
      }
    }
  };

>>>>>>> Update map to use natural sdk and update formatting to black
  $scope.markers = [];

  Map.initialize().then(function(map) {
    $scope.map = map;
    Map.initializeMarkerLayer($scope.map);
    $scope.center = Map.getCenter($scope.map);
    $scope.map.addListener('click', function(e) {
      $scope.map.setCenter({
        lat: e.latLng.lat() + 0.00075,
        lng: e.latLng.lng()
      });
      $scope.map.setZoom(18);
      Map.findNearbyPlaces(e.latLng, $scope.map).then(function(places) {
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          console.log($scope.markers.length, place);
          var marker = Map.createDestination(place, $scope.markers.length.toString(), $scope.map)
          $scope.markers.push(marker);
        }
      });
    });
<<<<<<< b2f8349cbcea1b2f6f978c85341d97246e84270d
  });
}])
=======
  }*/

/*  $scope.searchbox = {
    // GET template from when we saved in $templateCache in app.js
    template: 'searchbox.tpl.html',
    position: 'TOP_RIGHT',
    options: {
      autocomplete: true,
      types: ['point_of_interest', 'establishment']
    },
    events: {
      place_changed: function (autocomplete){

        place = autocomplete.getPlace();

        if (place.address_components) {
          
          newMarkers = [];
          // var bounds = new google.maps.LatLngBounds();

          var marker = {
            idKey: place.place_id,
            place_id: place.place_id,
            name: place.address_components[0].long_name,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            // templateurl:'window.tpl.html',
            // templateparameter: place,
            // events: {
            //   click: function (marker) {
            //     $scope.window.coords = {
            //       latitude: marker.model.latitude,
            //       longitude: marker.model.longitude
            //     };
            //     $scope.window.templateparameter = marker.model.templateparameter;
            //     $scope.window.show = true;
                
            //   }
            // }
          };
          
          newMarkers.push(marker);

          // bounds.extend(place.geometry.location);

          // $scope.map.bounds = {
          //   northeast: {
          //     latitude: bounds.getNorthEast().lat(),
          //     longitude: bounds.getNorthEast().lng()
          //   },
          //   southwest: {
          //     latitude: bounds.getSouthWest().lat(),
          //     longitude: bounds.getSouthWest().lng()
          //   }
          // };

          $scope.markers = newMarkers;
        } else {
          console.log('do something else with the search string: ' + place.name);
        }
      }
    }
  }*/

  // Create map (promise) and after
/*  uiGmapGoogleMapApi.then(function() { 

    // // API marker creation tool
    // $scope.createOptions = {
    //   drawingMode: google.maps.drawing.OverlayType.MARKER,
    //   drawingControlOptions: {
    //     position: google.maps.ControlPosition.TOP_CENTER,
    //     drawingModes: [
    //       google.maps.drawing.OverlayType.MARKER,
    //     ]
    //   },
    //   markerOptions: {
    //     visible: false,
    //     animation: google.maps.Animation.BOUNCE
    //   },
    // };

    // When user clicks on map to find locations, use API to find nearby places of interest
    // var el = document.getElementsByClassName('angular-google-map');
    // console.log(el);
    // var map = angular.element(document.getElementsByClassName('angular-google-map')[1]);
    // console.log(document.getElementsByClassName('angular-google-map')[1]);
    // google.maps.event.addListener(document.getElementsByClassName('angular-google-map')[1], 'click', function(e) {
    //   console.log(e.latLng);
    //   $scope.findNearbyPlaces(e.latLng);
    // });
  });*/

  // call when game is to be created
/*  $scope.submitWaypoints = function() {

    // get user for ajax request
    $scope.user = $window.localStorage.getItem('user');
    // get waypoints from map and submit to server to create createGame
    Requests.createGame($scope.user, $scope.markers)
      .then(function(res) {

        // get back hashed game url and display
        var gameUrl = res.data;
        $scope.gamePath = gameUrl; //<------ to be game url
      });

      // hide map on game creation
      $scope.showMap = false;

  };*/
}])

/*.directive('infowindow', function($compile) {
  return {
    restrict: 'E',
    scope: {
      data: '='
    },
    link: function (scope, element, attrs) {
      console.log("Case test running")
    },
    templateUrl: '/views/infowindow.html'


    // template: '<div class="iw">Name: {{data.name}} Address: {{data.photo}}</div>'
    // template: '<div class="iw">\
    //   <div class="iw-name">{{data.name}}</div>\
    //   <img class="iw-photo" ng-src={{data.photo}} />\
    // </div>',
    // link: function ( scope, element, attrs ) {
    //   // scope.$watch('pluginui', function(newValue) {
    //   //    var jqLiteWrappedElement = angular.element('<div ' + newValue + ' width=...');
    //   //    element.replaceWith(jqLiteWrappedElement);
    //   //    $compile(jqLiteWrappedElement)(scope);
    //   // })

    //   var el;

    //   attrs.$observe( 'template', function ( tpl ) {
    //     if ( angular.isDefined( tpl ) ) {
    //       // compile the provided template against the current scope
    //       el = $compile( tpl )( scope );

    //       // stupid way of emptying the element
    //       element.html("");

    //       // add the template content
    //       element.append( el );
    //     }
    //   });
    // },
    // replace: true

  };
});*/
