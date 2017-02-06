#!/bin/bash
rm -rf dist
mkdir dist
npm install
node_modules/.bin/browserify src/index.js --standalone credit-card-validator -o dist/credit-card-validator.js
node_modules/.bin/uglifyjs dist/credit-card-validator.js -o dist/credit-card-validator.min.js