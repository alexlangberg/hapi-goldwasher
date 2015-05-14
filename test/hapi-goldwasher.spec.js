'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var Hapi = require('hapi');
var defaultPath = '/goldwasher';

describe('goldwasher plugin with default options', function() {
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
      console.log(response.result);
      response.statusCode.should.equal(200);
      done();
    });
  });
});

describe('goldwasher throws on invalid options', function() {
  var server = new Hapi.Server();
  server.connection({port: 7980});

  it('loads', function(done) {
    server.register({
      register: require('../lib/hapi-goldwasher.js'),
      options: {path: 'dfg'}
    }, function(error) {
      console.log('dodndn');
      console.log('erråå', error);

      //error.should.be.an(Error);
      done();
    });
  });
});