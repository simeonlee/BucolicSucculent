Gulp File:

2 environments:
Development
Production

Development:

devStart: 
1. sets the environment to development
2. deletes all in the dist folder
3. lints client-side code
4. sets watch, minifies js and css files and sent to dist folder
5. sets watch, copy html and minified bower dependencies and sent to dist folder
6. start nodemon server


prodStart:
1. sets the environment to production
2. deletes all in the dist folder
3. lints client-side code
4. sets watch, minifies js and css files and sent to dist folder
5. sets watch, copy html and minified bower dependencies and sent to dist folder
6. start server with "forever" package