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
}]).factory('genericInterceptor', function($q, $rootScope) {
    var interceptor = {
        'request': function(config) {
            // Successful request method
            $rootScope.loadCompetition = true;
            return config; // or $q.when(config);
        },
        'response': function(response) {
            // Successful response
            $rootScope.loadCompetition = false;
            return response; // or $q.when(config);
        },
        'requestError': function(rejection) {
            // An error happened on the request
            // if we can recover from the error
            // we can return a new request
            // or promise
            $rootScope.loadCompetition = false;
            return response;
            // Otherwise, we can reject the next
            // by returning a rejection
            // return $q.reject(rejection);
        },
        'responseError': function(rejection) {
            
            // Returning a rejection
            $rootScope.loadCompetition = false;
            return rejection;
        }
    };
    return interceptor;
})

.controller('ComposeCtrl', function($scope, APIService, Upload, $uibModal, $localstorage) {
	var islogin = $localstorage.get('islogin');
	  if(islogin!=1){
	      window.location = "index.html";
	  }
  
	$scope.logout = function(){
       $localstorage.set('islogin', "0");
	   window.location = "index.html";
	}
    $scope.compose = {};
    $scope.compose.editerdata = "";
    $scope.editerdata = function(){
        console.log($scope.compose.editerdata);
    }


})