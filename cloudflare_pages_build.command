#!/bin/bash
npm install --force --global yarn
mv .yarn.lock yarn.lock
mv .package.json package.json
yarn
yarn build
