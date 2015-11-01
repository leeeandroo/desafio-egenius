'use strict';

var express = require('express');
var controller = require('./chat.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/:room_id', auth.isAuthenticated(), controller.list);
router.post('/', auth.isAuthenticated(), controller.create);

module.exports = router;