#!/usr/bin/env bash

# Merge the template into the main JavaScript file.

node ./merge-template.js ./fo-sticky-note.js ./fo-sticky-note-template.html 

# Build the bundle.

rollup -c

# Go ahead and copy the files that will be published on npm to the npm directory.

cp -f ../dist/fo-sticky-note-bundle.js ../npm/fo-sticky-note-bundle.js
echo Copied fo-sticky-note-bundle.js to npm directory.
cp -f ../README.md ../npm/README.md
echo Copied README.md to npm directory.
