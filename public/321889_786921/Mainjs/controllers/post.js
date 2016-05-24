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
            req_url: 'http://localhost:8000/api/getLatestJobs',
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
          req_url: 'http://localhost:8000/api/addLatestJob',
          data: {latestJobData: post, delete_images : $scope.deleteImages}
      }).then(function(resp) {
      	console.log(resp);
          if(resp.data) {
            ngDialog.open({ template: 'sucess.html', className: 'ngdialog-theme-default' });
          	window.location = "post.html";
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
          url: 'http://localhost:8000/api/uploadPhotos',
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
          url: 'http://localhost:8000/api/uploadPhotos',
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
      console.log("hihhhhhhhhhhh");
     APIService.updateData({
          req_url: 'http://localhost:8000/api/updateLatestJob',
          data: {latestJobData: post, delete_images : $scope.deleteImages}
      }).then(function(resp) {
        console.log(resp);
          if(resp.data) {
            ngDialog.open({ template: 'update.html', className: 'ngdialog-theme-default' });
            window.location = "post.html";
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };

}).controller('DeleteConfirmationCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, product){
    $scope.delete = function () {
        APIService.removeData({
            req_url: 'http://localhost:8000/api/removeLatestJob',
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