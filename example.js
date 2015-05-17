'use strict';

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