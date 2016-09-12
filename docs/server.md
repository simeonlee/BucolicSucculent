
ARCHITECTURAL OVERVIEW: SERVER

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
