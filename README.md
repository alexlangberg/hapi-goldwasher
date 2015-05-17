# hapi-goldwasher
[![npm version](http://img.shields.io/npm/v/hapi-goldwasher.svg)](https://www.npmjs.org/package/hapi-goldwasher)
[![Build Status](http://img.shields.io/travis/alexlangberg/hapi-goldwasher.svg)](https://travis-ci.org/alexlangberg/hapi-goldwasher)
[![Coverage Status](http://img.shields.io/coveralls/alexlangberg/hapi-goldwasher.svg)](https://coveralls.io/r/alexlangberg/hapi-goldwasher?branch=master)
[![Code Climate](http://img.shields.io/codeclimate/github/alexlangberg/hapi-goldwasher.svg)](https://codeclimate.com/github/alexlangberg/hapi-goldwasher)

[![Dependency Status](https://david-dm.org/alexlangberg/hapi-goldwasher.svg)](https://david-dm.org/alexlangberg/hapi-goldwasher)
[![devDependency Status](https://david-dm.org/alexlangberg/hapi-goldwasher/dev-status.svg)](https://david-dm.org/alexlangberg/hapi-goldwasher#info=devDependencies)

A plugin for [hapi](https://www.npmjs.com/package/hapi) to run [goldwasher](https://www.npmjs.org/package/goldwasher) as a scraping API on the web. Basically a scraper proxy that will return information in the selected format, defaulting to JSON.

## Installation
```
npm install hapi-goldwasher
```

If you aren't already running a [hapi](https://www.npmjs.com/package/hapi) server, you need to install this too, to run the example:
```
npm install hapi
```

## Options
When registering the plugin with [hapi](https://www.npmjs.com/package/hapi), you have several options, non of them required:
- ```path``` - the endpoint you mount the plugin on. Defaults to ```/goldwasher```.
- ```maxRedirects``` - the maximum number of redirects the scraper will accept before giving up. Defaults to ```5```.
- ```cors``` - a CORS object. Defaults to ```false```. See [hapi docs](http://hapijs.com/api#route-options) for more information.
- ```raw``` - enable raw output mode. This will enable ```output=raw``` that will return the raw, scraped result, usually HTML.

## Parameters
- ```url``` - url to scrape. **Required**.
- ```selector``` - cheerio (jQuery) selector, a selection of target tags. Defaults to the default of goldwasher, usually ```'h1, h2, h3, h4, h5, h6, p'```.
- ```search``` - only pick results containing these terms. Not case or special character sensitive.
- ```limit``` - limit number of results.
- ```output``` - output format (```json```, ```xml```, ```atom```, ```rss``` or - if enabled - ```raw```).
- ```filterTexts``` - stop texts that should be excluded.
- ```filterKeywords``` - stop words that should be excluded as keywords.
- ```filterLocale``` - stop words from external JSON file (see documentation on [goldwasher](https://www.npmjs.org/package/goldwasher))).

## Example
```javascript
var Hapi = require('hapi');
var HapiGoldwasher = require('./index');

var server = new Hapi.Server();
server.connection({ port: 7979 });

server.register({
  register: HapiGoldwasher,
  options: {
    path: '/goldwasher',
    cors: {
      origin: ['*']
    }
  }
}, function(err) {
  if (err) {
    throw err;
  }

  server.start(function() {
    console.log('Server running at: ' + server.info.uri);
  });
});
```

Go to the server uri and you will be presented with a JSON response containing documentation. I recommend using something like the [Chrome JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) for readability.