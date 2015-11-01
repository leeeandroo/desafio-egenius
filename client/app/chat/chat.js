'use strict';

angular.module('chatApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        url: '/chat/:id',
        templateUrl: 'app/chat/chat.html',
        controller: 'ChatCtrl',
        authenticate: true
      });
  });