'use strict';

var _ = require('lodash');
var Room = require('./room.model');

// Get list of rooms
exports.index = function(req, res) {
  Room.find(function(err, rooms) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(rooms);
  });
};

// Get a single room
exports.show = function(req, res) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return handleError(res, err);
    }
    if (!room) {
      return res.status(404).send('Not Found');
    }
    return res.json(room);
  });
};


// Creates a new room in the DB.
exports.create = function(req, res) {
  Room.create(req.body, function(err, room) {
    
    if (err) {
      return handleError(res, err);
    }
    return res.status(201).json(room);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}