#!/bin/bash
pwd
mkdir dist
pwd
node_modules/.bin/browserify src/index.js --standalone credit-card-validator -o dist/credit-card-validator.js
pwd
node_modules/.bin/uglifyjs dist/credit-card-validator.js -o dist/credit-card-validator.min.js