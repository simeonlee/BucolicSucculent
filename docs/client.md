Client dependencies:

From bower.json:
Angular
angular-google-maps
ui-router
ngGeolocation


More dependencies in index.html:
JQuery
Bootstrap
Lodash
angular-simple-logger


Client structure:

-index.html
  -navbar (Responsive with regards to screen width)
  -ui-view (Other templates get loaded into ui-view)

-app.js (Entry point for angular)
  -ui router (To load different views)
  -initiate Google map api library by using a key and choosing Google map libraries
  -on "run" initiate parent states of app

-services.js (Holds all AJAX (REST) calls and Authentication library functions)
  -AJAX functions
  -Authentication functions

-Auth Controller (Handles post AJAX calls and redirects)
  -Login View
  -Signup View

-createGame Controller (Sets up the Google map where the user can place markers and create a game)
  -createGame View
  -uiGmapGoogleMapApi (Is a promise that initializes and returns the map which allows for rendering and saving the markers)
  -submitWaypoints function (Sends the marker locations long/lat to the server and receives the generated gameUrl and displays the url)

-Dashboard Controller (Gets data from server about a particular users' games. It links to particular game)
  -Dashboard View

-game.js (Holds the parent controller "GameController" and children controllers "GameMap" and "GameStats")
  -GameController (Controls redirects and authentication checks. Allows for nested views)
    -GameView (includes ui-view to display GameMap View and GameStats View)


    -GameMap Controller (Renders the saved markers and gets user location from browser via Geolocation API. Validates location against marker.)
      -GameMap View (Has a location check for if the geolocation api doesn't work. Users can validate locations using the corresponding button below the map)


    -GameStats Controller ( Does the get request in the resolve and saves the data in $scope.players)
      -GameStats View (Displays the games for a specific user)


Google Map API:

Angular has a googlemaps-angular library which was used. It is fully documented at https://angular-ui.github.io/angular-google-maps/#!/ 


Angular interface for browser geolocation API doc:
https://github.com/ninjatronic/ngGeolocation

Styles: https://coolors.co/313715-d16014-939f5c-bbce8a-e2f9b8

