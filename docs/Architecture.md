
ARCHITECTURAL OVERVIEW

SERVER

  DATABASE
  Uses a relational database with mySql.
  The database utilizes 5 tables:
  Users
    - Stores usernames and encrypted passwords of all users
  Games
    - Stores foreign Key to User Table for the game's creator and the pathUrl
  Locations
    - Stores latitude, longitude, sequence order, and the foreign key to Game table
  UserGame
    - Stores many-to-many relationship between Users/Games
  Statuses
    - Stores many-to-many relationships between Users/Locations and the current status.

  SEQUELIZE
    - ORM used to interact with mySql database through javascript.

  ROUTING
    - 3 endpoints set up on server to handle RESTful requests.
    - /api/game, GET, POST, PUT
      - Used to create Games, have users join new games, and to retrieve up-to-date game data for client
    - /api/users/signup, POST
      - Used to create new users into the database, and pass authentication token
    - /api/users/login, POST
      - Used to login existing users and pass authentication token

  JWT

  JSON Web Token is a standard format that can be signed and/or encrypted. We use encryption, refered to as JWE (JSON Web Encryption). The JWT specification is from the Internet Engineering Task Force (IETF) and is published as RFC 7519 (https://tools.ietf.org/html/rfc7519).  Also see:  RFC 7797 (JWS), RFC 7516 (JWE), RFC 7165 (JOSE), RFC 7520 (mas JOSE).

JWT has up to seven claims defined by the spec, we use two to make up the token:

Claim        |     Description
-----------------------------------------------
iss          |   Issuer of the JWT
exp          |   Time the JWT is set to expire

We also send the username in the JWT body for convenience. Additional info can easily be incorporated and could be used to dictate the privileges of the user.

ARCHITECTURAL OVERVIEW

CLIENT

Dependencies:

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


Client Code structure:

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


Google Map API Usage:

  Angular has a googlemaps-angular library which was used. It is fully documented at https://angular-ui.github.io/angular-google-maps/#!/ 


  Angular interface for browser geolocation API doc:
https://github.com/ninjatronic/ngGeolocation

Styles: https://coolors.co/313715-d16014-939f5c-bbce8a-e2f9b8

