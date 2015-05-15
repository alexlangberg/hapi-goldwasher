'use strict';

var Hoek = require('hoek');
var Joi = require('joi');
var Boom = require('boom');
var needle = require('needle');
var goldwasher = require('goldwasher');

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

var getResponse = function(server, options, request) {

  var response = {
    hello: 'world',
    uri: server.connections[0].info.uri
  };

  return response;
};

exports.register = function(server, options, next) {

  options = getOptions(options);

  server.route({
    method: 'GET',
    path: options.path,
    handler: function(request, reply) {
      reply(getResponse(server, options, request));
    },
    config: {
      validate: {
        query: {
          filterKeywords: Joi.array(),
          filterLocale: Joi.string().valid('en'),
          filterTexts: Joi.array(),
          limit: Joi.number().integer(),
          output: Joi.string().valid('json', 'xml', 'atom', 'rss'),
          search: Joi.array(),
          selector: Joi.string(),
          url: Joi.string()
        }
      }
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};