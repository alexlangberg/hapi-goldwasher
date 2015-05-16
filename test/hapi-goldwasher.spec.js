'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var Hapi = require('hapi');
var defaultPath = '/goldwasher';
var needle = require('needle');

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

describe('setup, routes and queries', function() {
  var server = new Hapi.Server();
  server.connection({port: 7979});

  it('loads', function(done) {
    server.register({
      register: require('../lib/hapi-goldwasher.js'),
      options: { raw: true }
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
    var url = urlWithParameters({ url: 'http://google.com'});

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      done();
    });
  });

  it('can request with all other parameters', function(done) {
    var url = urlWithParameters({
      url: 'http://google.com',
      selector: 'h1',
      search: 'foo',
      output: 'json',
      limit: 5,
      filterKeywords: 'bar; baz',
      filterTexts: 'bar is good, baz is evil',
      filterLocale: 'en'
    });

    server.inject({ method: 'GET', url: url }, function(response) {
      response.statusCode.should.equal(200);
      done();
    });
  });

  it('can reply with xml', function(done) {
    var url = urlWithParameters({
      url: 'http://google.com',
      output: 'xml'
    });

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      response.headers['content-type'].should.equal('text/xml; charset=utf-8');
      done();
    });
  });

  it('can reply with atom', function(done) {
    var url = urlWithParameters({
      url: 'http://google.com',
      output: 'atom'
    });

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      response.headers['content-type'].should.equal('application/atom+xml');
      done();
    });
  });

  it('can reply with rss', function(done) {
    var url = urlWithParameters({
      url: 'http://google.com',
      output: 'rss'
    });

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      response.headers['content-type'].should.equal('application/rss+xml');
      done();
    });
  });

  it('can reply with raw', function(done) {
    var url = urlWithParameters({
      url: 'http://google.com',
      output: 'raw'
    });

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(200);
      done();
    });
  });
});

describe('error handling', function() {
  var server = new Hapi.Server();
  server.connection({port: 7979});

  before(function(done) {
    server.register({
      register: require('../lib/hapi-goldwasher.js'),
      options: { maxRedirects: 0 }
    }, function() {
      server.start(function() {
        done();
      });
    });
  });

  it('can can handle invalid url', function(done) {
    var url = urlWithParameters({ url: 'foo'});

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(404);
      done();
    });
  });

  it('can can handle too many redirects', function(done) {
    var url = urlWithParameters({ url: 'http://google.com'});

    server.inject({method: 'GET', url: url}, function(response) {
      response.statusCode.should.equal(404);
      done();
    });
  });

  it('prevents recursive calls', function(done) {
    var url = server.info.uri +
      urlWithParameters({ url: server.info.uri}) +
      defaultPath;

    needle.get(url, function(error, response, body) {
      body.statusCode.should.equal(403);
      body.message.should.equal('http://bit.ly/IqT6zt');
      done();
    });
  });
});