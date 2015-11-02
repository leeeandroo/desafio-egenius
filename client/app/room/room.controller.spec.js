'use strict';

describe('Controller: RoomCtrl', function () {

  // load the controller's module
  beforeEach(module('app/room/rooms.html'));
  beforeEach(module('app/main/main.html'));
  beforeEach(module('chatApp'));
  beforeEach(module('socketMock'));
  
  var RoomCtrl,
      scope,
      $httpBackend;
      

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;

    scope = $rootScope.$new();

    
    $httpBackend
      .whenGET("/api/rooms")
        .respond(function (method, url, data, headers) {
            return [200, [{ 'name' : 'Room 01' }, { 'name' : 'Room 02' }], {}];
        });

    RoomCtrl = $controller('RoomCtrl', {
      $scope: scope
    });
  }));  


  it('should attach a list of rooms to the scope', function () {
    $httpBackend.flush();     
    expect(scope.rooms.length).toBe(2);    
  });


  it('should add new room to the scope', function () {
    $httpBackend.flush();    
    expect(scope.rooms.length + 1).toBe(3);
  });


  
});


