'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoomSchema = new Schema({
  name: String
});


// Validate empty name
RoomSchema
  .path('name')
  .validate(function(name) {
    return name.length;
  }, 'Name cannot be blank');


module.exports = mongoose.model('Room', RoomSchema);