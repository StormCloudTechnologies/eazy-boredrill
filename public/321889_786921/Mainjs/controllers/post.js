angular.module('Post.controllers', [])

.controller('PostCtrl', function($scope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
  
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
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

  $scope.editProject = function() {
      var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/editPost.html',
          controller: 'EditPostCtrl',
          size: 'lg'
      });
    modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  }

    $scope.updatePostlist = function(Data) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updatePost.html',
            controller: 'UpdatePostCtrl',
            size: 'lg',
            resolve: {
                product: function () {
                    return Data;
                }
            }
        });
      modalInstance.result.then(function (productData) {
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }
 


 
    $scope.deletePost = function(post) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
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
 
    

})
.controller('EditPostCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
     $scope.post = {images:[]};
      $scope.AddPost = function(post) {
          console.log(post);
         APIService.setData({
              req_url: url + 'api/addLatestJob',
              data: {latestJobData: post, delete_images : $scope.deleteImages}
          }).then(function(resp) {
            console.log(resp);
              if(resp.data.message=="Project has been added successfully.") {
                $uibModalInstance.close(resp.data);
                ngDialog.open({ template: 'sucess.html', className: 'ngdialog-theme-default' });
                 setTimeout(function() {
                    $state.go('admin.post');
                  }, 100);
              }else{
                $uibModalInstance.close(resp.data);
                ngDialog.open({ template: 'error.html', className: 'ngdialog-theme-default' });
                setTimeout(function() {
                  $state.go('admin.post');
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
  $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('UpdatePostCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, product){
    $scope.post = {images:[]};
    $scope.post = product;
     $scope.deleteImages = [];

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
            $uibModalInstance.close(resp.data);
            ngDialog.open({ template: 'update.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.post');
            }, 100);
            
          }else{
            $uibModalInstance.close(resp.data);
            ngDialog.open({ template: 'error.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.post');
            }, 100);
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
})

.controller('DeleteConfirmationCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, product){
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