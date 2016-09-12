Server-Side Tests:

    - Uses Mocha/Chai and supertest
    - integrated with TravisCI and github for testing on all Pull Requests

     Signup/Login for Users

      - Destroy entries in database before/after each test to maintain test integrity 
      - Send the test 'username' and 'password' in the request header

      On User Signup
        - check for new User entry in the database
        - check that authentication token is returned
        - server will return an error if username already exists

      On User Login
        - returns an authentication token if login is successful
        - returns a 401 error if password is incorrect
        - returns a 401 error if user does not exist

    Creating/Joining a Game

      - Authentication token is required for creating/joinng games, so create dummy user to retain
      - Uses dummy location data before each test

      On Game Creation
        - send username, token, and location data to create game and save path Url for game
        - check for new Game entry in the database (via pathUrl)
        - check for new Location entries in the database linked to the game (via pathUrl)

    Joining a Game and/or getting Game Data
        
      - Uses /api/game endpoint with different queries

      Getting Game Data for specific User and specific Game
        - Before tests, query server with both Username and PathUrl
        - If it's the first time querying for specifc User and game, check database for new Location/User entries (Statuses)
        - Verify data returned the entries's default is set to 'false'

      Getting all Games for specific User
        - before tests, create 2nd game with dummy location data, then associate new game to user
        - verify queries with only username returns game data for both games

      Getting User statuses for specific Game
        - before tests, create a 2nd user and associate the 2nd user with original game
        - verify queries with only pathUrl returns the statuses of both users

    Updating Location data for a User (the Statuses)

      - create a brand new game and new user and associate game to user before the test.

      Updating that status
        - submit a PUT request to one of the locations of the game/Location
        - verify the location data returned from query is updated for the user.