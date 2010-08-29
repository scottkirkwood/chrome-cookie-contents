//
// Copyright 2010 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

var lastUrl = "";
var rePattern = new RegExp('^(http[s]?[:]//[^/]+[.][^/.]+)/');

/**
 * @fileoverview Make the center table or div left.
 * @author scottkirkwood@google.com (Scott Kirkwood)
 */
chrome.extension.onConnect.addListener(
  function(port) {
    if (port.name != 'cookies') {
      console.log('Not listening to port named: ' + port.name);
      return;
    }
    port.onMessage.addListener(
      function(msg) {
        console.log('Got message: ' + msg.cmd);
        if (msg.cmd == 'getCookies') {
          if (lastUrl) {
            sendCookies(port, lastUrl);
          }
        } else {
          console.log('Got unknown message: ' + msg.cmd);
          port.postMessage({error: 'unknown message'});
        }
      }
    );
  }
);

/**
 * Send the cookie information from the url via chrome API.
 */
var sendCookies = function(port, url) {
  chrome.cookies.getAll({
        'url': url
      },
      function (cookies) {
        console.log('Len: ' + cookies.length);
        port.postMessage({
            'cmd': 'cookies',
            'url': url,
            'data': cookies});
      }
  );
};

/**
 * Get the page URL and send the cookies to a new page.
 * @param info OnClickData
 * @param tab Tab that was clicked.
 */
var onShowcookies = function(info, tab) {
  console.log('full url is: ' + tab.url);
  var grps = rePattern.exec(tab.url)
  lastUrl = '';
  if (grps.length) {
    lastUrl = grps[1];
  }
  console.log('domain is:' + lastUrl);
  chrome.tabs.create({
      'url': chrome.extension.getURL('cookiejar.html')},
      function (newTab) {
        console.log('Window created');
      });
}

chrome.contextMenus.create(
    {"title": "Cookie Contents...", "onclick": onShowcookies});

