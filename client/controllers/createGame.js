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
}])



















/*  var transparent = './images/marker/falseMarker/transparent-200x350.png';

  $scope.showMap = true;

<<<<<<< 2e83d073d0aba51de1610d100202e5362b457762
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

<<<<<<< d588c791a13dd18047a3f70794383249f7466f33
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
<<<<<<< 7aa48ab82db9aee38e0416457a00d0f517df7f9c
<<<<<<< cd059397f601929d6da5827fab43ca67ec9b635d
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
=======
        for (var i = 0; i < 1; i++) {
=======
        for (var i = 0; i < 5; i++) {
>>>>>>> Add ability to retrieve place photo urls from google api
          var place = results[i];
          var name = place.name;
          var rating = place.rating;
          if (place.photos && place.photos[0]) {
            var width = place.photos[0].width;
            var photoUrl = place.photos[0].getUrl({maxWidth: 200, maxHeight: 200});
            console.log(photoUrl);
          } else {
            var photoUrl = null;
          };
          var marker = {
            sequence: sequence,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            options: {
              icon: transparent,
              animation: google.maps.Animation.BOUNCE
>>>>>>> Add marker canvas technology
            }
          })(i);
        }
        $scope.map.center = {
          latitude: latLng.lat(),
          longitude: latLng.lng()
        };
<<<<<<< cd059397f601929d6da5827fab43ca67ec9b635d
        // Zoom in to select places more easily
        $scope.map.zoom = 18;

        // console.log($('img[src="' + transparent + '"]'));
=======
        $scope.map.zoom = 18;

        // Apply changes to digest loop in order to render labeled markers
        $scope.$apply();
<<<<<<< 7aa48ab82db9aee38e0416457a00d0f517df7f9c
>>>>>>> Add marker canvas technology
=======

        $('img[src="' + transparent + '"]')
          .parent()
          .addClass('canvas hover')
          .append($('<div>', {'class': 'ring marker'}))
          .append($('<div>', {'class': 'shadow'}))
          .append($('<div>', {'class': 'iw'}));
        $('iw')
          .append()
        console.log($('img[src="' + transparent + '"]'));
>>>>>>> Add ability to retrieve place photo urls from google api
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

=======
=======
>>>>>>> Implement nearby search and map click events system
  $scope.map = {
    // Default San Francisco
    center: {
      latitude: 37.7836881,                 
      longitude: -122.4090401 
    }, 
    zoom: 14,
    events: {
      tilesloaded: function (map, eventName, originalEventArgs) {
        // Once map is loaded and ready, this callback is hit
      },
      click: function (mapModel, eventName, originalEventArgs) {
        var e = originalEventArgs[0];
        $scope.findNearbyPlaces(e.latLng);
      }
    },
    markers: []
  };
>>>>>>> Apply minor comment and styling cleanups to createGame.js

<<<<<<< 2e83d073d0aba51de1610d100202e5362b457762
<<<<<<< 24c6309bb5f667642d963aedb5baedccb470c532
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
=======
=======
  // Find nearby places using Google API based on location
  // https://developers.google.com/maps/documentation/javascript/places#place_search_requests
  $scope.findNearbyPlaces = function(latLng) {
    var request = {
      location: latLng,
      radius: '50', // meters
      types: ['establishment']
    };
    service = new google.maps.places.PlacesService(document.createElement('div'));
    service.nearbySearch(request, function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(results);
        var sequence = 0;
        for (var i = 0; i < 5; i++) {
          var place = results[i];
          var marker = {
            sequence: sequence,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            markerOptions: {
              // visible: false,
              animation: google.maps.Animation.BOUNCE
            }
          };
          $scope.map.markers.push(marker);
          sequence++;
        }
        // Apply changes to digest loop in order to render labeled markers
        $scope.$apply();
      }
    });
  }

>>>>>>> Implement nearby search and map click events system
  $scope.searchbox = {
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

          $scope.map.markers = newMarkers;
        } else {
          console.log('do something else with the search string: ' + place.name);
        }
      }
    }
  }

<<<<<<< 2e83d073d0aba51de1610d100202e5362b457762
  $scope.map.markers = []; //<--------- save marker coords here
>>>>>>> Add searchbox in createGame and searchbox template in app.js

    //   var el;

<<<<<<< d588c791a13dd18047a3f70794383249f7466f33
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
// =======
//     //API marker creation tool
//     $scope.createOptions = {
//       drawingMode: google.maps.drawing.OverlayType.MARKER,
//       drawingControlOptions: {
//         position: google.maps.ControlPosition.TOP_CENTER,
//         drawingModes: [
//           google.maps.drawing.OverlayType.MARKER,
//         ]
//       },
//       markerOptions: {
//         visible: false
//         // draggable: true, //<------------- WISHLIST fix draggable marker coords saving and uncomment
//       },
//     };
//     //for each game, the first marker gets labeled '1'
//     var sequence = 1;

//     // on each marker addition
//     google.maps.event.addListener($scope.createOptions, 'overlaycomplete', function(event) {

//       var marker = {
//         sequence: sequence,
//         latitude: event.overlay.position.lat(),
//         longitude: event.overlay.position.lng(),
//         options: {
//           label: sequence.toString()
//         }
//       };

//       // push coords to markers array
//       $scope.map.markers.push(marker);

//       // apply changes to digest loop in order to render labelled markers
//       $scope.$apply();

//       // increment sequence prop for next label
//       sequence++;
//     });
//   });
// }]);
// >>>>>>> Apply minor comment and styling cleanups to createGame.js
// =======
//   // Create map (promise) and after
//   uiGmapGoogleMapApi.then(function() { 

//     // // API marker creation tool
//     // $scope.createOptions = {
//     //   drawingMode: google.maps.drawing.OverlayType.MARKER,
//     //   drawingControlOptions: {
//     //     position: google.maps.ControlPosition.TOP_CENTER,
//     //     drawingModes: [
//     //       google.maps.drawing.OverlayType.MARKER,
//     //     ]
//     //   },
//     //   markerOptions: {
//     //     visible: false,
//     //     animation: google.maps.Animation.BOUNCE
//     //   },
//     // };

//     // When user clicks on map to find locations, use API to find nearby places of interest
//     // var el = document.getElementsByClassName('angular-google-map');
//     // console.log(el);
//     // var map = angular.element(document.getElementsByClassName('angular-google-map')[1]);
//     // console.log(document.getElementsByClassName('angular-google-map')[1]);
//     // google.maps.event.addListener(document.getElementsByClassName('angular-google-map')[1], 'click', function(e) {
//     //   console.log(e.latLng);
//     //   $scope.findNearbyPlaces(e.latLng);
//     // });
//   });

//   // call when game is to be created
//   $scope.submitWaypoints = function() {

//     // get user for ajax request
//     $scope.user = $window.localStorage.getItem('user');
//     // get waypoints from map and submit to server to create createGame
//     Requests.createGame($scope.user, $scope.map.markers)
//       .then(function(res) {

//         // get back hashed game url and display
//         var gameUrl = res.data;
//         $scope.gamePath = gameUrl; //<------ to be game url
//       });

//       // hide map on game creation
//       $scope.showMap = false;

//   };
// }]);
// >>>>>>> Implement nearby search and map click events system
