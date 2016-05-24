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
.controller('ProjectCtrl', function($scope, APIService, Upload, $uibModal, $localstorage, ngDialog) {
  
  var islogin = $localstorage.get('islogin');
  if(islogin!=1){
      window.location = "index.html";
  }

	$scope.logout = function(){
     $localstorage.set('islogin', "0");
	   window.location = "index.html";
	}
  $scope.no_product = true;
  $scope.projectlist = [];
  
  $scope.getProject = function() {
     APIService.setData({
            req_url: 'http://localhost:8000/api/getProjects',
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
	$scope.AddProject = function(project) {
      console.log(project);
		 APIService.setData({
          req_url: 'http://localhost:8000/api/addProject',
          data: {projectData: project, delete_images : $scope.deleteImages}
      }).then(function(resp) {
      	console.log(resp);
          if(resp.data) {
            ngDialog.open({ template: 'sucess.html', className: 'ngdialog-theme-default' });
            window.location = "project.html";
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
          url: 'http://localhost:8000/api/uploadPhotos',
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
    $scope.deleteProject = function(project) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteConfirmation.html',
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
    $scope.addProject = function(){
       $scope.project = {};
    }
    $scope.update = function(data){
       $scope.project = data;
    }

    $scope.removeChoice1 = function(index){
        $scope.deleteImages.push($scope.project.images[index]);
        $scope.project.images.splice(index,1);
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
          req_url: 'http://localhost:8000/api/updateProject',
          data: {projectData: project, delete_images : $scope.deleteImages}
      }).then(function(resp) {
        console.log(resp);
          if(resp.data) {
            ngDialog.open({template: 'update.html', className: 'ngdialog-theme-default' });
            window.location = "project.html";
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };

}).controller('DeleteConfirmationCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, product){
    $scope.delete = function () {
        APIService.removeData({
            req_url: 'http://localhost:8000/api/removeProject',
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