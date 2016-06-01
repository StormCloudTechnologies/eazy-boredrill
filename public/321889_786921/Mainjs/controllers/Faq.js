angular.module('Faq.controllers', [])


.controller('FaqCtrl', function($scope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
	  var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }

  $scope.oneAtATime = true;

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    open : true,
    isCustomHeaderOpen: false,
    isFirstOpen: true,
    isFirstDisabled: false
  };
	

	$scope.no_product = true;
  $scope.projectlist = [];
  $scope.project = {images:[]};
  $scope.getProject = function() {
     APIService.setData({
            req_url: url + 'api/getProjects',
            data: {projectData:{}}
        }).then(function(resp) {
          console.log(resp);
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.projectlist = resp.data;

            }else{
              $scope.no_product = true;
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getProject();
  $scope.project = {images:[]};
	

    

    $scope.editProject = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/editProject.html',
            controller: 'EditProjectCtrl',
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

    $scope.updateProjectlist = function(Data) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updateProject.html',
            controller: 'UpdateProjectCtrl',
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
 

    $scope.deleteProject = function(project) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteConfirmationCtrl',
            size: 'sm',
            resolve: {
                product: function () {
                    return project;
                }
            }
        });
        modalInstance.result.then(function (productData) {
            if(productData.length != 0) {
                $scope.no_product = false;
                $scope.projectlist = productData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.projectlist = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
 
   

}).controller('EditProjectCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
    $scope.project = {images:[]};
    $scope.AddProject = function(project) {
     console.log(project);
     APIService.setData({
          req_url: url + 'api/addProject',
          data: {projectData: project, delete_images : $scope.deleteImages}
      }).then(function(resp) {
        console.log(resp);
          if(resp.data.message=="Project has been added successfully.") {
            ngDialog.open({ template: 'partials/sucess.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.projectlist');
            }, 100);
            $uibModalInstance.close(resp.data);
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.projectlist');
            }, 100);
            $uibModalInstance.close(resp.data);
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };

  $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.project.images[index]);
        $scope.project.images.splice(index,1);
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
                   $scope.project.images = $scope.ImagePath;
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
.controller('UpdateProjectCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, product){
    $scope.project = {images:[]};
    $scope.project = product;
     $scope.deleteImages = [];

    $scope.removeChoice1 = function(index){
        $scope.deleteImages.push($scope.project.images[index]);
        $scope.project.images.splice(index,1);
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
                    $scope.project.images.push(item.path);
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

    $scope.UpdateProject = function(project) {
     APIService.updateData({
          req_url: url + 'api/updateProject',
          data: {projectData: project, delete_images : $scope.deleteImages}
      }).then(function(resp) {
        console.log(resp);
          if(resp.data.message=="Updated successfully.") {
            ngDialog.open({ template: 'partials/update.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.projectlist');
            }, 100);
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.projectlist');
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
            req_url: url + 'api/removeProject',
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