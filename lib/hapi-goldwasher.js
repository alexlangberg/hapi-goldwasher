'use strict';

var Hoek = require('hoek');
var Joi = require('joi');
var Boom = require('boom');
var needle = require('needle');
var goldwasher = require('goldwasher');
var pack = require('../package.json');
var goldwasherPack = require('../node_modules/goldwasher/package.json');

var stringToArray = function(text) {
  return text
    .split(';')
    .map(function(word) {
      return word.trim();
    });
};

var getOptions = function(options) {
  var schema = Joi.object().keys({
    path: Joi.string()
  });

  var defaults = {
    path: '/goldwasher'
  };

  Joi.validate(options, schema);

  return Hoek.applyToDefaults(defaults, options);
};

var getDefaultResponse = function(server, options) {
  var text = {
    commaSeparated: ' (comma-separated for multiple,' +
                    ' remember url encoding)',
    locale: ' (filter common stop words by language, "en" available)'
  };

  return {
    name: options.name || pack.name,
    description: options.description || pack.description,
    docs: options.docs || pack.homepage,
    uri: server.connections[0].info.uri,
    parameters: {
      url: 'string (required)',
      selector: 'string (jQuery selector)',
      search: 'string' + text.commaSeparated,
      output: 'string ("json", "xml", "atom" or "rss")',
      limit: 'integer (limits number of results)',
      filterKeywords: 'string' + text.commaSeparated,
      filterTexts: 'string' + text.commaSeparated,
      filterLocale: 'string' + text.locale
    },
    goldwasher: {
      url: goldwasherPack.homepage,
      version: goldwasherPack.version,
      options: goldwasherPack.goldwasher.options,
      defaults: goldwasherPack.goldwasher.defaults
    }
  };
};

var getResponse = function(server, options, request, callback) {

  // if no url is given, send back general information of how to use
  if (!request.query.hasOwnProperty('url')) {
    return callback(null, getDefaultResponse(server, options));
  }

  // if url is given, start scraping
  needle.get(request.query.url, function(error, response, body) {
    var options = Hoek.clone(request.query);
    var result;

    if (options.search) {
      options.search = stringToArray(options.search);
    }

    if (options.filterKeywords) {
      options.filterKeywords = stringToArray(options.filterKeywords);
    }

    if (options.filterTexts) {
      options.filterTexts = stringToArray(options.filterTexts);
    }

    result = goldwasher(body, options);

    return callback(null, result);
  });
};

exports.register = function(server, options, next) {

  options = getOptions(options);

  server.route({
    method: 'GET',
    path: options.path,
    handler: function(request, reply) {
      getResponse(server, options, request, function(error, result) {
        reply(result);
      });
    },

    config: {
      validate: {
        query: {
          filterKeywords: Joi.string(),
          filterLocale: Joi.string().valid('en'),
          filterTexts: Joi.string(),
          limit: Joi.number().integer(),
          output: Joi.string().valid('json', 'xml', 'atom', 'rss'),
          search: Joi.string(),
          selector: Joi.string(),
          url: Joi.string()
        }
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: pack
};