'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('room', {
        url: '/rooms',
        templateUrl: 'app/room/rooms.html',
        controller: 'RoomCtrl',
        authenticate: true
      });
  });