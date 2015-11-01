'use strict';

var should = require('should');
var app = require('../../app');
var Room = require('./room.model');

var request = require('supertest');

var room = new Room({
  name: 'Room 01'
});

describe('Room Model', function() {

  it('should fail when saving without a name', function(done) {
    room.name = '';
    room.save(function(err) {
      should.exist(err);
      done();
    });
  });

});