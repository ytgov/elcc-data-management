#!/bin/sh

if [ "$NODE_ENV" != "production" ]; then
  # Run initializers in development
  npm run initializers
else
  # Run initializers in production
  node ./dist/initializers/index.js
fi

# Start the application
if [ "$NODE_ENV" != "production" ]; then
  npm run start
else
  node ./dist/server.js
fi
