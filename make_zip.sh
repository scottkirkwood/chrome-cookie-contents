#!/bin/bash
#
# Copyright 2010 Google Inc. All Rights Reserved.
# Author: scottkirkwood@google.com (Scott Kirkwood)

ver=$(grep version manifest.json | cut -c15-17)
echo "Version is: $ver"
echo -n "Is this correct? (ctrl-c to abort)"
read

rm "chrome_cookie_contents_$ver.zip"
zip "chrome_cookie_contents_$ver.zip" COPYING *.html *.js *.png *.json js/* css/**/* css/**/**/*
