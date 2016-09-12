
ARCHITECTURAL OVERVIEW: SERVER

  DATABASE

  SEQUELIZE

  ROUTING

  JWT

  JSON Web Token is a standard format that can be signed and/or encrypted. We use encryption, refered to as JWE (JSON Web Encryption). The JWT specification is from the Internet Engineering Task Force (IETF) and is published as RFC 7519 (https://tools.ietf.org/html/rfc7519).  Also see:  RFC 7797 (JWS), RFC 7516 (JWE), RFC 7165 (JOSE), RFC 7520 (mas JOSE).

JWT has up to seven claims defined by the spec, we use two to make up the token:

Claim        |     Description
-----------------------------------------------
iss          |   Issuer of the JWT
exp          |   Time the JWT is set to expire

We also send the username in the JWT body for convenience. Additional info can easily be incorporated and could be used to dictate the privileges of the user.
