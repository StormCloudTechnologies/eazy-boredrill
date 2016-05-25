angular.module('starter', ['APIModule'])
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
.controller('LoginCtrl', function($scope, APIService, $localstorage) {
    $scope.allvalue = true;
    var islogin = $localstorage.get('islogin');
    if(islogin==1){
        window.location = "home.html";
    }

    $scope.forgetpassword = function(){
        $scope.allvalue = false;
    }
    $scope.gotologin = function(){
        $scope.allvalue = true;
    }
	$scope.login = function(productObj) {
        APIService.setData({
            req_url: 'http://52.39.156.51:8000/api/adminLogin',
            data: productObj
        }).then(function(resp) {
          if(resp.data.message=="success") {
                $localstorage.set('islogin', "1");
            	window.location = "home.html";
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
    $scope.resetpassword = function() {
         APIService.setData({
            req_url: 'http://52.39.156.51:8000/api/forgotAdminPassword',
            data: ''
        }).then(function(resp) {
            console.log(resp);
            if(resp.data.successMessage=="Credentials has been sent to your Email.") {
                $scope.allvalue = true;
            }else{
                alert(resp.data.message);
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
});