'use strict';

var goldwasher = require('goldwasher');
var Hoek = require('hoek');
var Joi = require('joi');

var getOptions = function(options) {
  var schema = Joi.object().keys({
    path: Joi.string()
  });

  var defaults = {
    path: '/goldwasher'
  };

  //Joi.validate(options, schema, function(error) {
  //  if (error) {
  //    throw error;
  //  }
  //});

  // overwrite default options if options object is provided
  return Hoek.applyToDefaults(defaults, options);
};

exports.register = function(server, options, next) {

  options = getOptions(options);

  server.route({
    method: 'GET',
    path: options.path,
    handler: function(request, reply) {
      var response = {
        hello: 'world',
        uri: server.connections[0].info.uri
      };

      reply(response);
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('../package.json')
};