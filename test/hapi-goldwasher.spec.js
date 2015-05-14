'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var validator = require('validator');
var cheerio = require('cheerio');
var plugin = require('../lib/hapi-goldwasher');
var R = require('ramda');

//describe('init', function() {
//  it('loads', function(done) {
//    done();
//  });
//});