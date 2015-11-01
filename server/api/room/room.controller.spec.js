'use strict';

/* jshint -W117, -W030 */

var should = require('should');
var mongoose = require('mongoose');
var sinon = require('sinon');
var app = require('../../app');
var Room = require('./room.model');
var User = require('../user/user.model');

var request = require('supertest');

describe('Room: Controllers', function() {
  
  var sandbox,
      token,
      room_id;

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

              Room.find({}).remove(function(){
                Room.create({
                  name: 'Fake Room'
                }, function() {
                  
                  request(app)
                    .get('/api/rooms')
                    .set('Authorization', 'Bearer '  + token)  
                    .expect(200)
                    .end(function(err, res) {
                      room_id = res.body[0]._id;
                      done();
                    })
                }
                )
              });
            })
        }
      );
    });




  });
  

  beforeEach(function(done) {

    sandbox = sinon.sandbox.create();
    done();
    
  });

  afterEach(function(done) {
    sandbox.restore();
    done();
  });

  describe('Index Controller', function() {
    var fakeRooms = ['Room 1', 'Room 2', 'Fake Room'];

    it('should respond with 200 with the list of rooms if everything succeds', function(done) {
      
      sandbox.stub(mongoose.Model, 'find', function(cb) {
        cb(null, fakeRooms);
      });

      request(app)

        .get('/api/rooms')      
        .set('Authorization', 'Bearer '  + token)  
        .expect('Content-Type', /json/)
        .expect(200, fakeRooms)
        .end(function(err, res) {
          if (err) return done(err);
          done();
        });

    });

    it('should respond with 500 if error', function(done) {
      var err = "An error ocurred";
      sandbox.stub(mongoose.Model, 'find', function(cb) {
        cb(err, null);
      });

      request(app)
        .get('/api/rooms')
        .set('Authorization', 'Bearer '  + token)  
        .expect('Content-Type', /html/)
        .expect(500, err, done);
    });
  });

  describe('Create Controller', function() {
    var roomData = {
      name: 'test room'
    };

    it('should call Room.create with provided arguments', function(done) {
      
      var createFn = sandbox.stub(mongoose.Model, 'create', function(res, cb) {
        cb(null, res);
      });
      
      var r = request(app)
        .post('/api/rooms')
        .set('Authorization', 'Bearer '  + token) 
        .send(roomData)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {   
          if (err) return done(err);
          createFn.callCount.should.equal(1);
          createFn.calledWith(roomData).should.true;          
          done();
        });



    });


    it('should respond with 401 if user is not logged', function(done){
      var createFn = sandbox.stub(mongoose.Model, 'create');

      request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect('Content-Type', /html/)
        .expect(401)
        .end(function(err, res) { 
          if (err) return done(err);   
          createFn.callCount.should.equal(0);
          done();
        });

    });
  });

  describe('Show Controller', function(){
    var roomData = {
      name: 'test room'
    };

    it('should respond with 500 if error', function(done){
      var err = "An error ocurred";

      sandbox.stub(mongoose.Model, 'findById', function(res, cb) {
        cb(err, null);
      });

      request(app)
        .get('/api/rooms/'+ room_id)
        .set('Authorization', 'Bearer '  + token)  
        .expect('Content-Type', /html/)
        .expect(500, done);        
    });

    it('should respond with 401 if user is not logged', function(done){

      var showStub = sandbox.stub(mongoose.Model, 'findById', function(res, cb) {
        cb(null, fakeChatMessages);
      });

      request(app)
        .get('/api/rooms/562a752075c7cf5c1dbd6eb7')      
        .expect('Content-Type', /html/)
        .expect(401)
        .end(function(err, res) {
          
          if (err) return done(err);
          showStub.callCount.should.equal(0);
          done();
        });
    });

    it('should respond with 200 with the room if everything succeds', function(done){
      sandbox.stub(mongoose.Model, 'findById', function(res, cb) {
        cb(null, roomData);
      });

      request(app)
        .get('/api/rooms/562a752075c7cf5c1dbd6eb7')      
        .set('Authorization', 'Bearer '  + token)  
        .expect('Content-Type', /json/)
        .expect(200, roomData)
        .end(function(err, res) {          
          if (err) return done(err);
          done();
        });
    });

  });
});