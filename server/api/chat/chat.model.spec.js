'use strict';

var should = require('should');
var app = require('../../app');
var Chat = require('./chat.model');

var request = require('supertest');

var chat;

describe('Chat Model', function() {

	beforeEach(function(done) {
		chat = new Chat({
		  body: "Message test",
		  author: "User test",
		  date: Date.now(),
		  room: "562a752075c7cf5c1dbd6eb7"
		});		

		done();
	});	

  it('should fail when saving without a body', function(done) {
    chat.body = '';
    chat.save(function(err) {
      should.exist(err);
      done();
    });
  });


  it('should fail when saving without a author', function(done) {
  	chat.author = '';
  	chat.save(function(err){
  		should.exist(err);
  		done();
  	});
  });

  it('should fail when saving without a date', function(done){
  	chat.date = '';
  	chat.save(function(err){
  		should.exist(err);
  		done();
  	});
  });

  it('should fail when saving without a room', function(done){
  	chat.room = '';
  	chat.save(function(err){
  		should.exist(err);
  		done();
  	});
  });

});