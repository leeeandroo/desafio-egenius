'use strict';

angular.module('chatApp')
  .controller('RoomCtrl', function ($scope, $http, socket) {
    $scope.rooms = [];

    $http.get('/api/rooms').success(function(rooms) {
      $scope.rooms = rooms;      
      socket.syncUpdates('room', $scope.rooms);
    });

    $scope.addRoom = function() {
      if($scope.newRoom === '') {
        return;
      }
      $http.post('/api/rooms', { name: $scope.newRoom });
      $scope.newRoom = '';
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('room');
    });

  });
