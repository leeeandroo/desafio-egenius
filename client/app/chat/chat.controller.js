'use strict';

angular.module('chatApp')
  .controller('ChatCtrl', function ($scope, $http, $state, $timeout, socket, Auth) {
		$scope.room = [];
		
	    $http.get('/api/rooms/'+ $state.params.id).success(function(room) {
	      $scope.room = room; 
	    });

	    $http.get('/api/chats/'+ $state.params.id).success(function(messages) {
	      $scope.messages = messages;
	      socket.syncUpdates('chat', $scope.messages, function(){
	      	$timeout(function() {				
				$scope.scrollToBottom();
		    }, 0, false);
	      });
	    });


	    $scope.scrollToBottom = function(){	    	
			var scroller = document.getElementById('autoscroll');				
			scroller.scrollTop = scroller.scrollHeight;						    
	    };

	    $timeout(function() {	
			$scope.scrollToBottom();
		});

    	$scope.getCurrentUser = Auth.getCurrentUser();

	    $scope.sendMessage = function () {

			if(!$scope.newMessage) {
				return;
			}
			
			$http.post('/api/chats', { 
				body: $scope.newMessage, 
				author: $scope.getCurrentUser.name, 
				date: Date.now(), 
				room: $scope.room._id 
			});
			$scope.newMessage = '';
	    };
    
});

		