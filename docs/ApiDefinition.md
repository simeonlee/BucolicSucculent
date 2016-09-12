|      URL                         | HTTP Verb | Request Body |                             Result                                           |
|:--------------------------------:|:---------:|:------------:|:----------------------------------------------------------------------------:|
| /api/game?username               |    GET    |    empty     |                                                     Return JSON of all games |
| /api/game?username&gameId        |    GET    |    empty     |    Find or create JSON of game information for that user to render front-end |
| /api/game?username&gameId        |    PUT    |     JSON     |                                               Return updated location status |
| /api/game                        |    POST   |     JSON     |                 Create a new game given the locations and return the game id |
| /api/users/signup                |    POST   |     JSON     |       Creates the account in the db and Return authentication somehow (jwt) |
| /api/users/login                 |    POST   |     JSON     |                                         Return authentication somehow (jwt) |


SIGN UP
1. user goes to home page '/' -> redirects to login
2. user clicks sign up and fills out form and submits ->
  POST /api/users/signup  (submits stringifed JSON object with username and password)
  {
    "username": "Sam"
    "password": "hr47"
  }
3.  server passes back an authenticated jwt which is stored in the 
  client headers and retransmitted with every subsequent request.

LOGIN
1.  user fills out login page and submits ->
  POST /api/users/login (submits JSON object with username and password)
  {
    "username": "Sam"
    "password": "hr47"
  }

2.  server passes back an authenticated jwt which is stored in the 
  client headers and retransmitted with every subsequent request.


CREATING/JOINING A GAME
1. a user creates the game -> 
  POST /api/game/create (includes the long/lat and map etc)
  Backend creates the game and links the creator to the user's id

2. a user checks the dashboard ->
  GET /api/game?username

3. a user joins an existing created game ->
  GET /api/game?username&gameId
  If gameId DOES NOT exist inside user/game table, then create locations in db and return JSON of game info for front end to render Game View
  if gameId DOES exist, give them current game info for that user

4. a user toggles a location ->
  PUT /api/game?username&gameId
  Client sends in current location and a key-value of the specific location id that was clicked and sends a true/false value to the server.
  The server will take the current location and compare it with the location in the database and check if they are actually there. *
  Return back the value of that location true/false so that the client can rerender only that location


