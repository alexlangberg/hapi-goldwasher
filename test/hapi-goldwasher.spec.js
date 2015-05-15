'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var Hapi = require('hapi');
var defaultPath = '/goldwasher';

describe('setup and routes', function() {
  var server = new Hapi.Server();
  server.connection({port: 7979});

  it('loads', function(done) {
    server.register({
      register: require('../lib/hapi-goldwasher.js')
    }, function(error) {
      should.not.exist(error);
      done();
    });
  });

  it('registers default route', function(done) {
    var table = server.table();
    table.should.have.length(1);
    table[0].table[0].path.should.equal(defaultPath);
    done();
  });

  it('has a working route', function(done) {
    server.inject({method: 'GET', url: defaultPath}, function(response) {
      response.statusCode.should.equal(200);
      done();
    });
  });

  it('can request with url parameter', function(done) {
    var url = defaultPath + '?url=' + encodeURIComponent('http://www.dr.dk');
    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      done();
    });
  });
});

describe('options validation', function() {
  var server = new Hapi.Server();
  server.connection({port: 7980});

  it('throws on invalid path', function(done) {
    try {
      server.register({
        register: require('../lib/hapi-goldwasher.js'),
        options: {path: 'foo'}
      }, function(error) {
        throw error;
      });
    } catch (error) {
      should.exist(error);
      done();
    }
  });
});