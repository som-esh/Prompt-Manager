#!/bin/sh
sudo chown -R 100:100 ./backend/docker
sudo chmod -R 755 ./backend/docker
docker compose build
docker compose up -d
cd frontend
npm install
npm run dev
