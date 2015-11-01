'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ChatSchema = new Schema({
  body: String,
  author: String,
  date: Date,
  room: String  
});


// Validate empty body
ChatSchema
  .path('body')
  .validate(function(body) {
    return body.length;
  }, 'Body cannot be blank');


//Validate empty author
ChatSchema
  .path('author')
  .validate(function(author) {
    return author.length;
  }, 'Author cannot be blank');

//Validate empty date
ChatSchema
	.path('date')
	.validate(function(date){
		return date.length;
	}, 'Date cannot be blank');

//Validate empty room
ChatSchema
	.path('room')
	.validate(function(room){
		return room.length;
	}, 'Room cannot be blank');


module.exports = mongoose.model('Chat', ChatSchema);