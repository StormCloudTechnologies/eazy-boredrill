angular.module('starter', ['APIModule', 'ngFileUpload', 'ui.bootstrap'])
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])	

.controller('HomeCtrl', function($scope, APIService, Upload, $uibModal, $localstorage) {
	var islogin = $localstorage.get('islogin');
	  if(islogin!=1){
	      window.location = "index.html";
	  }
  
	$scope.logout = function(){
       $localstorage.set('islogin', "0");
	   window.location = "index.html";
	}
})