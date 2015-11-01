'use strict';

/* jshint -W117, -W030 */

var should = require('should');
var mongoose = require('mongoose');
var sinon = require('sinon');
var app = require('../../app');
var Chat = require('./chat.model');
var User = require('../user/user.model');

var request = require('supertest');

describe('Chat: Controllers', function() {

	var sandbox,
      	token;

  	before(function(done){
	    User.find({}).remove(function() {
	      User.create({
	        provider: 'local',
	        name: 'Test User',
	        email: 'test@test.com',
	        password: 'test'
	      }, function() {
	          
	          request(app)
	            .post('/auth/local')
	            .send({email:'test@test.com', password:'test'})
	            .expect(200)
	            .end(function(err, res){
	            	
	              token = res.body.token;
	              done();
	            })
	        }
	      );
	    });


	  });

	beforeEach(function(done) {
		sandbox = sinon.sandbox.create();
		done();
	});

	afterEach(function(done){
		sandbox.restore();
		done();
	});

	describe('List Controller', function(){
		var fakeChatMessages = [
			{
				'body': "Fake message",
				'author': "Fake Author",
				'date': Date.now(),
				'room': '562a752075c7cf5c1dbd6eb7'
			},
			{
				'body': "Fake message",
				'author': "Fake Author",
				'date': Date.now(),
				'room': '562a752075c7cf5c1dbd6eb7'
			}
		];

		
		it('should respond with 200 with list of messages for determine room if everything succeds', function(done) {

			sandbox.stub(mongoose.Model, 'find', function(res, cb) {
				cb(null, fakeChatMessages);
			});

			request(app)
				.get('/api/chats/562a752075c7cf5c1dbd6eb7')      
				.set('Authorization', 'Bearer '  + token)  
				.expect('Content-Type', /json/)
				.expect(200, fakeChatMessages)
				.end(function(err, res) {
					
					if (err) return done(err);

					for(var i = 0; i < res.body.length; i++) {
						should(res.body[i]).have.property('room', '562a752075c7cf5c1dbd6eb7');
					}
					done();
				});

		});


		it('should respond with 401 if user is not logged', function(done){
			
			var listStub = sandbox.stub(mongoose.Model, 'find', function(res, cb) {
				cb(null, fakeChatMessages);
			});

			request(app)
				.get('/api/chats/562a752075c7cf5c1dbd6eb7')      
				.expect('Content-Type', /html/)
				.expect(401)
				.end(function(err, res) {
					
					if (err) return done(err);

					listStub.callCount.should.equal(0);
					done();
				});
		});


		it('should respond with 500 if error', function(done) {
			var err = "An error ocurred";

			sandbox.stub(mongoose.Model, 'find', function(res, cb) {
				cb(err, null);
			});

			request(app)
				.get('/api/chats/562a752075c7cf5c1dbd6eb7')
				.set('Authorization', 'Bearer '  + token)  
				.expect('Content-Type', /html/)
				.expect(500, err, done);
		});	

	});

	describe('Create Controller', function(){
		var chatData = {
			'body': "Fake message",
			'author': "Fake Author",
			'date': Date.now(),
			'room': '562a752075c7cf5c1dbd6eb7'
		};

		it('should call Chat.create with provided arguments', function(done){
			var createFn = sandbox.stub(mongoose.Model, 'create', function(res, cb) {
				cb(null, res);
			});

			var r = request(app)
				.post('/api/chats')
				.set('Authorization', 'Bearer '  + token) 
				.send(chatData)
				.expect('Content-Type', /json/)
				.expect(201)
				.end(function(err, res) {   
					if (err) return done(err);
					createFn.callCount.should.equal(1);
					createFn.calledWith(chatData).should.true;          
					done();
				});
		});

		it('should respond with 401 if user is not logged', function(done){
			var createFn = sandbox.stub(mongoose.Model, 'create');

			request(app)
				.post('/api/chats')
				.send(chatData)
				.expect('Content-Type', /html/)
				.expect(401)
				.end(function(err, res) { 
					if (err) return done(err);   
					createFn.callCount.should.equal(0);
					done();
				});
		});

	});
});