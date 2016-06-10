angular.module('main.controllers', [])
.controller('AppCtrl', function($scope, $localstorage, $rootScope) {
  
  $rootScope.activeState = 'home';

})