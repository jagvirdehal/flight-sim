#!/bin/bash

PORT=3030

docker run -p $PORT:3030 --name flight-sim -d --rm flight-sim
echo "Running at: http://localhost:$PORT"
