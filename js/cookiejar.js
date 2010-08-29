
var showSessionCookies = false;

var setupTabs = function() {
  $('#tabmenu').tabs();
};

var port = chrome.extension.connect({name: 'cookies'});

var selectAllText = function() {
  console.log('Select all');
  this.focus();
  this.select();
};

var toggleCheckBox = function(evt) {
  showSessionCookies = !showSessionCookies;
  $('.session-cookies').attr('checked', showSessionCookies);
  if (showSessionCookies) {
    console.log('Show session cookies');
  } else {
    console.log('Don\'t session cookies');
  }
  evt.preventDefault();
  port.postMessage({'cmd': 'getCookies'});
};

port.onMessage.addListener(
  function(msg) {
    if (msg.cmd == 'cookies') {
      console.log('Got cookies message');
      console.log('len: ' + msg.data.length);
      $('#mozilla').text(getCookiesTxtMozilla(msg.data, msg.url));
      $('#lwp').text(getCookiesTxtLwp(msg.data, msg.url));
      $('#omni').text(getCookiesTxtOmniweb(msg.data, msg.url));
      $('#url').text(msg.url);
      $('.info').one('click', selectAllText);
      $('.session-cookies').click(toggleCheckBox);
    }
  }
);

var zeroPad = function(num) {
  var ret = '' + num;
  if (ret.length == 1) {
    return '0' + num;
  }
  return ret;
};

/**
 * Return date as posix timestamp.
 * If adate is undefined it returns tomorrow's date.
 */
var makeDate = function(adate) {
  if (!adate) {
    return (Math.round(new Date().getTime() / 1000.0) + 24 * 3600);
  }
  return adate;
};

var getCookiesTxtLwp = function(cookies, url) {
  var list = [
     '#LWP-Cookies-1.0'
  ];
  for (var cookie_index in cookies) {
    var cookie = cookies[cookie_index];
    if (!cookie.session || showSessionCookies) {
      var secure = '';
      if (cookie.secure) {
        secure = 'secure; ';
      }
      var expDate = makeDate(cookie.expirationDate);
      var d = new Date(expDate * 1000);
      var expires = d.getUTCFullYear() + '-' +
          zeroPad(d.getUTCMonth() + 1) + '-' +
          zeroPad(d.getUTCDate()) + 'T' +
          zeroPad(d.getUTCHours()) + ':' +
          zeroPad(d.getUTCMinutes()) + ':' +
          zeroPad(d.getUTCSeconds()) + 'Z';
      list.push('Set-Cookie3: ' +
                cookie.name + '="' + cookie.value + '"; ' +
                'path="' + cookie.path + '"; ' +
                'path_spec; ' +
                secure +
                'domain="' + cookie.domain + '"; ' +
                'expires="' + expires + '"; ' +
                'version=0');
    }
  }
  list.push('');
  return list.join('\n');
};

var getCookiesTxtMozilla = function(cookies, url) {
  var list = [
      '# ',
      '# http://www.netscape.com/newsref/std/cookie_spec.html',
      '# This is a generated file!  Do not edit.',
      '# domain\tflag\tpath\tsecure\texpiration\tname\tvalue'
  ];
  for (var cookie_index in cookies) {
    var cookie = cookies[cookie_index];
    if (!cookie.session || showSessionCookies) {
      var expDate = makeDate(cookie.expirationDate);
      list.push(cookie.domain + '\t' +
                (cookie.hostOnly ? 'TRUE' : 'FALSE') + '\t' +
                (cookie.secure ? 'TRUE' : 'FALSE') + '\t' +
                expDate + '\t' +
                cookie.name + '\t' +
                cookie.value);
    }
  }
  list.push('');
  return list.join('\n');
};

var getCookiesTxtOmniweb = function(cookies, url) {
  var list = [
     '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
     '<!DOCTYPE OmniWebCookies SYSTEM "http://www.omnigroup.com/DTDs/OmniWebCookies.dtd">',
     '<OmniWebCookies>'
  ];
  for (var cookie_index in cookies) {
    var cookie = cookies[cookie_index];
    if (!cookie.session || showSessionCookies) {
      var secure = '';
      if (cookie.secure) {
        secure = '; secure';
      }
      var expDate = makeDate(cookie.expirationDate);
      list.push('  <domain name="' + cookie.domain + '">');
      list.push('    <cookie name="' + cookie.name + '" value="' +
          cookie.value + '" expires="' + expDate + '" />');
      list.push('  </domain>');
    }
  }
  list.push('</OmniWebCookies>');
  return list.join('\n');
};

port.postMessage({'cmd': 'getCookies'});

