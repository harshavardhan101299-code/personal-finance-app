#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(cat .env.local | xargs)
    echo "Environment variables loaded:"
    echo "REACT_APP_GOOGLE_CLIENT_ID=$REACT_APP_GOOGLE_CLIENT_ID"
else
    echo "Warning: .env.local file not found!"
fi

# Start the React development server
npm start
