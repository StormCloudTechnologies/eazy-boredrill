angular.module('ProjectList.controllers', [])


.controller('ProjectListCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
	  $rootScope.activeState = 'project';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }
	

	$scope.no_product = true;
  $scope.projectlist = [];
  $scope.project = {images:[]};
  $scope.getProject = function() {
     APIService.setData({
            req_url: url + 'api/getProjects',
            data: {projectData:{}}
        }).then(function(resp) {
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
	

    

    $scope.AddProject = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/AddProject.html',
            controller: 'AddProjectCtrl',
            size: 'lg'
        });
      modalInstance.result.then(function (projectData) {
         if(projectData.length != 0) {
                $scope.no_product = false;
                $scope.projectlist = projectData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.projectlist = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
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
                project: function () {
                    return Data;
                }
            }
        });
      modalInstance.result.then(function (projectData) {
           if(projectData.length != 0) {
                $scope.no_product = false;
                $scope.projectlist = projectData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.projectlist = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }
 

    $scope.deleteProject = function(project) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteProjectCtrl',
            size: 'sm',
            resolve: {
                project: function () {
                    return project;
                }
            }
        });
        modalInstance.result.then(function (projectData) {
            if(projectData.length != 0) {
                $scope.no_product = false;
                $scope.projectlist = projectData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.projectlist = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
 
   

}).controller('AddProjectCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
    $scope.project = {images:[]};
    $scope.AddProject = function(project) {
     APIService.setData({
          req_url: url + 'api/addProject',
          data: {projectData: project, delete_images : $scope.deleteImages}
      }).then(function(resp) {
          if(resp.data) {
            ngDialog.open({ template: 'partials/sucess.html', className: 'ngdialog-theme-default' });
            $uibModalInstance.close(resp.data);
            
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
                        
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
.controller('UpdateProjectCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, project){
    $scope.project = {images:[]};
    $scope.project = project;
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
          if(resp.data) {
            ngDialog.open({ template: 'partials/update.html', className: 'ngdialog-theme-default' });
            $uibModalInstance.close(resp.data);
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
            
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
})
.controller('DeleteProjectCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, project){
    $scope.delete = function () {
        APIService.removeData({
            req_url: url + 'api/removeProject',
            data: project
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