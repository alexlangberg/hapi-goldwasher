'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var Hapi = require('hapi');

describe('goldwasher plugin', function () {
  var server = new Hapi.Server();
  server.connection({port:80});

  it('loads', function (done) {
    server.register({
      register: require('../lib/hapi-goldwasher.js')
    }, function(err) {
      should.not.exist(err);
      done();
    });
  });

  //it('registers routes', function (done) {
  //  var table = server.table();
  //  table.should.have.length(1);
  //  table[0].table[0].path.should.equal('/');
  //  done();
  //});
  //
  //it('has a working route', function (done) {
  //  server.settings.app = {
  //    config: {
  //      product: {
  //        info: {}
  //      }
  //    }
  //  };
  //  server.inject({method: 'GET', url:'/'}, function(response) {
  //    response.statusCode.should.equal(200);
  //    done();
  //  });
  //});
  //
  //it('has a working route even without info object', function (done) {
  //  server.settings.app.config = {
  //    product: {}
  //  };
  //  server.inject({method: 'GET', url:'/'}, function(response) {
  //    response.statusCode.should.equal(200);
  //    done();
  //  });
  //});
});