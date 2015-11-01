'use strict';

var _ = require('lodash');
var Chat = require('./chat.model');

// Creates a new chat in the DB.
exports.create = function(req, res) {
  Chat.create(req.body, function(err, chat) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(chat);
  });
};

// Get a list of chat by room
exports.list = function(req, res) {
  Chat.find({ room: req.params.room_id }, function (err, chats) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(chats);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}