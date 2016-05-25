var url = 'http://52.39.156.51:8000/';
angular.module('starter', ['APIModule', 'ngFileUpload', 'ui.bootstrap', 'ngDialog'])
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
}]).directive('capitalizeFirst', function($parse) {
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
        var capitalize = function(inputValue) {
           if (inputValue === undefined) { inputValue = ''; }
           var capitalized = inputValue.charAt(0).toUpperCase() +
                             inputValue.substring(1);
           if(capitalized !== inputValue) {
              modelCtrl.$setViewValue(capitalized);
              modelCtrl.$render();
            }         
            return capitalized;
         }
         modelCtrl.$parsers.push(capitalize);
         capitalize($parse(attrs.ngModel)(scope)); // capitalize initial value
     }
   };
}).factory('genericInterceptor', function($q, $rootScope) {
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
.controller('PostCtrl', function($scope, APIService, Upload, $uibModal, $localstorage, ngDialog) {
  
  var islogin = $localstorage.get('islogin');
  if(islogin!=1){
      window.location = "index.html";
  }
	$scope.logout = function(){
     $localstorage.set('islogin', "0");
	   window.location = "index.html";
	}
  $scope.postlist = [];
  $scope.no_product = true;

  $scope.getPost = function() {
     APIService.setData({
            req_url: url + 'api/getLatestJobs',
            data: {latestJobData:{}}
        }).then(function(resp) {
          console.log(resp);
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.postlist = resp.data;
            }else{
               $scope.no_product = true;
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getPost();
  $scope.post = {images:[]};
	$scope.AddPost = function(post) {
      console.log(post);
		 APIService.setData({
          req_url: url + 'api/addLatestJob',
          data: {latestJobData: post, delete_images : $scope.deleteImages}
      }).then(function(resp) {
      	console.log(resp);
          if(resp.data.message=="Project has been added successfully.") {
            ngDialog.open({ template: 'sucess.html', className: 'ngdialog-theme-default' });
          	 setTimeout(function() {
                window.location = "post.html";
              }, 100);
          }else{
            ngDialog.open({ template: 'error.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              window.location = "post.html";
            }, 100);
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };

    $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.post.images[index]);
        $scope.post.images.splice(index,1);
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
                   $scope.ImagePath.push(item.path);
                   $scope.post.images = $scope.ImagePath;
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
    $scope.deletePost = function(post) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteConfirmation.html',
            controller: 'DeleteConfirmationCtrl',
            size: 'sm',
            resolve: {
                product: function () {
                    return post;
                }
            }
        });
        modalInstance.result.then(function (productData) {
            if(productData.length != 0) {
                $scope.postlist = productData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.postlist = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
    $scope.addPost = function(){
       $scope.post = {};
    }
    $scope.update = function(data){
       $scope.post = data;
    }

    $scope.removeChoice1 = function(index){
        $scope.deleteImages.push($scope.post.images[index]);
        $scope.post.images.splice(index,1);
    };
    $scope.uploadPhoto1 = function(file) {
        file.upload = Upload.upload({
          url: url + 'api/uploadPhotos',
          arrayKey: '',
          data: {file: file}
        });

        file.upload.then(function (response) {
           console.log(response);
           if(response.data.length > 0) {
                angular.forEach(response.data, function(item){
                    $scope.post.images.push(item.path);
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

    $scope.Updatepost = function(post) {
    APIService.updateData({
          req_url: url + 'api/updateLatestJob',
          data: {latestJobData: post, delete_images : $scope.deleteImages}
      }).then(function(resp) {
        console.log(resp);
          if(resp.data.message=="Updated successfully.") {
            ngDialog.open({ template: 'update.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              window.location = "post.html";
            }, 100);
            
          }else{
            ngDialog.open({ template: 'error.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              window.location = "post.html";
            }, 100);
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };

}).controller('DeleteConfirmationCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, product){
    $scope.delete = function () {
        APIService.removeData({
            req_url: url + 'api/removeLatestJob',
            data: product
        }).then(function(resp) {
            $uibModalInstance.close(resp.data);
           },function(resp) {
              // This block execute in case of error.
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});