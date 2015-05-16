'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var Hapi = require('hapi');
var defaultPath = '/goldwasher';

var urlWithParameters = function(obj) {
  var str = defaultPath + '?';
  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) { continue; }

    if (str !== defaultPath + '?') {
      str += '&';
    }

    str += key + '=' + encodeURIComponent(obj[key]);
  }

  return str;
};

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

  it('responds with default message if no url parameter', function(done) {
    server.inject({method: 'GET', url: defaultPath}, function(response) {
      response.statusCode.should.equal(200);
      response.result.should.have.property('name');
      response.result.should.have.property('description');
      response.result.should.have.property('docs');
      response.result.should.have.property('uri');
      response.result.should.have.property('parameters');
      response.result.should.have.property('goldwasher');
      done();
    });
  });

  it('can request with url parameter', function(done) {
    var url = urlWithParameters({ url: 'http://www.dr.dk'});
    //console.log(url);
    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      done();
    });
  });

  it('can request with all other parameters', function(done) {
    var url = urlWithParameters({
      url: 'http://www.dr.dk',
      selector: 'h1',
      search: 'foo',
      output: 'json',
      limit: 5,
      filterKeywords: 'bar; baz',
      filterTexts: 'bar is good, baz is evil',
      filterLocale: 'en'
    });
    //console.log(url);
    server.inject({method: 'GET', url: url}, function(response) {
      //console.log(response.result);
      response.statusCode.should.equal(200);
      done();
    });
  });
});

describe('options validation', function() {
  var server = new Hapi.Server();
  server.connection({port: 7979});

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