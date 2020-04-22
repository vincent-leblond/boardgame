#!/bin/sh
cd front
npm install
npm run build
cd ../server
npm install
cd ..
docker build . -t loopingz/boardgame:latest