angular.module('app.createGame', ['uiGmapgoogle-maps', 'app.services', 'app'])

.controller('createGameController', ['Map', '$scope', 'uiGmapGoogleMapApi', 'Requests', '$rootScope', '$window', 'isAuth', '$location', '$compile', function(Map, $scope, uiGmapGoogleMapApi, Requests, $rootScope, $window, isAuth, $location, $compile) {

  //check for JWT
  if (!isAuth) {
    $location.path('/login');
  }

  Map.initialize();























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

  $scope.markers = [];
  $scope.imageStorage = [];

  // Find nearby places using Google API based on location
  // https://developers.google.com/maps/documentation/javascript/places#place_search_requests
  $scope.findNearbyPlaces = function(latLng) {
    var request = {
      location: latLng,
      radius: '75', // meters
      types: ['establishment']
    };
    service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);

        var sequence = 0;
        $scope.markers = [];
        $scope.imageStorage = [];

        for (var i = 0; i < results.length; i++) {

          // Show only up to 5 images at one time
          if ($scope.imageStorage.length >= 5) { 
            break;
          }
          (function(i) {

            var place = {
              name: results[i].name,
              photo: typeof results[i].photos !== 'undefined' ? results[i].photos[0].getUrl({'maxWidth': 200, 'maxHeight': 140}) : '',
              location: {
                lat: results[i].geometry.location.lat(),
                lng: results[i].geometry.location.lng()
              },
              rating: results[i].rating
            };

            if (place.photo) {
              $scope.imageStorage.push(place.photo);

              var marker = {
                sequence: sequence,
                latitude: place.location.lat,
                longitude: place.location.lng,
                options: {
                  icon: transparent,
                  optimized: false
                },
                name: place.name,
                photo: place.photo,
                show: true
              };

              $scope.markers.push(marker);

 

              $scope[place.name] = place;

              // Apply changes to digest loop in order to render labeled markers
              $scope.$apply();

              console.log(marker);
              console.log($scope.markers[i]);

              // $scope.$watch(function() { return $scope.map.bounds; }, function(nv, ov) {
              var $transparentMarker = $('img[src="' + transparent + '"]');
              var $anchor = $transparentMarker.parent();
              // var uniqueWindowClass = 'iw-' + sequence;
              // var uniqueCanvasClass = 'canvas-' + sequence;
              // !$anchor.hasClass('canvas') && $anchor.addClass('canvas hover ' + uniqueCanvasClass);
              !$anchor.hasClass('canvas') && $anchor.addClass('canvas hover');
              // if (!$anchor.hasClass(uniqueCanvasClass) && !$anchor.find('div.ring').length) {
              if (!$anchor.find('div.ring').length) {
                $anchor
                  .append($('<div>', {'class': 'ring marker'}))
                  .append($('<div>', {'class': 'shadow'}))
                  // .append('<infowindow data=' + $scope.markers[i] + '></infowindow>')
                  .append($compile('<infowindow data=' + place.name + '></infowindow>')($scope));
                  // .append($('<div>', {'class': 'iw ' + uniqueWindowClass}));
              };

              // var $iw = $('.' + uniqueWindowClass);
              // console.log($iw);
              // if (!$iw.find('div.iw-name').length) {
              //   $iw
              //     .append('<div class="iw-name">' + name + '</div>')
              //     .append('<img class="iw-photo" src="' + photo + '"/>');
              // }

              // console.log($('.iw-content').parents());

                // Only need to regenerate once
                // if (!ov.southwest && nv.southwest) {
                  // var markers = [];
                  // for (var i = 0; i < 50; i++) {
                    // markers.push(createRandomMarker(i, $scope.map.bounds))
                  // }
                  // $scope.markers = markers;
                // }
              // }, true);

              sequence++;
            }
          })(i);
        }
        $scope.map.center = {
          latitude: latLng.lat(),
          longitude: latLng.lng()
        };
        // Zoom in to select places more easily
        $scope.map.zoom = 18;

        // console.log($('img[src="' + transparent + '"]'));
      }
    });
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
  $scope.submitWaypoints = function() {

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

  };
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