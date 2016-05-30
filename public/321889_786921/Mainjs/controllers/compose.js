var url = 'http://localhost:8000/';
angular.module('starter', ['APIModule', 'ngFileUpload', 'ui.bootstrap', 'colorpicker.module', 'wysiwyg.module'])
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
    console.log("hiii");
	$scope.logout = function(){
       $localstorage.set('islogin', "0");
	   window.location = "index.html";
	}
    $scope.compose = {images:[]};
    $scope.inputMessage = "";
    $scope.editerdata = function(){
      console.log($scope.inputMessage);
    }

    $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.compose.images[index]);
        $scope.compose.images.splice(index,1);
    };
    $scope.ImagePath = [];  
    $scope.uploadPhoto = function(file) {
        file.upload = Upload.upload({
          url: url + 'api/uploadPhotos',
          arrayKey: '',
          data: {file: file}
        });

        file.upload.then(function (response) {
           console.log(response);
           if(response.data.length > 0) {
                angular.forEach(response.data, function(item){
                   $scope.compose.images.push(item.path);
                   // $scope.project.images = $scope.ImagePath;
                });
             }
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };


})