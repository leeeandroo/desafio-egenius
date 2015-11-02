'use strict';

describe('Controller: ChatCtrl', function () {

  // load the controller's module
  beforeEach(module('app/chat/chat.html'));
  beforeEach(module('app/main/main.html'));
  beforeEach(module('chatApp'));
  beforeEach(module('socketMock'));
  
  var ChatCtrl,
      scope,
      $httpBackend,
      state,
      id;
  
  

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, $state, $stateParams) {
    $httpBackend = _$httpBackend_;
    
    state = { 'params': { 'id': '562a752075c7cf5c1dbd6eb7' } };
    
    $httpBackend
      .whenGET("/api/rooms/"+state.params.id)
        .respond(function (method, url, data, headers) {
            return [200, { 'name' : 'Room 01', '_id': '562a752075c7cf5c1dbd6eb7'  }, {}];
        });  

    $httpBackend
      .whenGET("/api/chats/562a752075c7cf5c1dbd6eb7")
        .respond(function (method, url, data, headers) {
            return [200, [{ 'body' : 'Fake message', 'author': 'Fake author', 'date': Date.now(), 'room': '562a752075c7cf5c1dbd6eb7' }], {}];
        });  

    scope = $rootScope.$new();      

    ChatCtrl = $controller('ChatCtrl', {
      $scope: scope,
      $state: state
    });
  }));  


  it('should attach a list of messages to the scope', function () {
    $httpBackend.flush();     
    expect(scope.messages.length).toBe(1);    
  });


  it('should add new room to the scope', function () {
    $httpBackend.flush();    
    expect(scope.messages.length + 1).toBe(2);
  });

  
  it('should a list of messages of determine room', function () {
    $httpBackend.flush();  

    for(var i = 0; i < scope.messages.length; i++) {
      expect(scope.messages[i].room).toBe('562a752075c7cf5c1dbd6eb7');  
    }  
    
  });


  
});


