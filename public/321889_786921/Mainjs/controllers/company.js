angular.module('Company.controllers', [])

.controller('CompanyCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
    $rootScope.activeState = 'Company';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }

  $scope.companylist = [];
  $scope.no_product = true;

  $scope.getCompany = function() {
     APIService.setData({
            req_url: url + 'api/getCompanyEquipment',
        }).then(function(resp) {
            console.log(resp);
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.companylist = resp.data;
            }else{
               $scope.no_product = true;
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getCompany();

  $scope.addCompany = function() {
      var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addcompany.html',
          controller: 'AddcompanyCtrl',
          size: 'lg'
        });
      modalInstance.result.then(function (companyData) {
          if(companyData.length != 0) {
                $scope.companylist = companyData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.companylist = [];
                $scope.no_product = true;
            }
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  }

    $scope.updateCompanyList = function(Data) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updatecompany.html',
            controller: 'UpdatecompanyCtrl',
            size: 'lg',
            resolve: {
                companyList: function () {
                    return Data;
                }
            }
        });
      modalInstance.result.then(function (companyData) {
          if(companyData.length != 0) {
                $scope.companylist = companyData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.companylist = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }
 


 
    $scope.deleteCompany = function(company) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteCompanyCtrl',
            size: 'sm',
            resolve: {
                companyList: function () {
                    return company;
                }
            }
        });
        modalInstance.result.then(function (companyData) {
            if(companyData.length != 0) {
                $scope.companylist = companyData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.companylist = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
 
    

})
.controller('AddcompanyCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
     $scope.company = {images:[]};
      $scope.addCompany = function(company) {
         company.delete_images = $scope.deleteImages;
         APIService.setData({
              req_url: url + 'api/addCompanyEquipment',
              data: company
          }).then(function(resp) {
              if(resp.data) {
                ngDialog.open({ template: 'partials/sucess.html', className: 'ngdialog-theme-default' });
                $uibModalInstance.close(resp.data);
              }else{
                ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
                $uibModalInstance.close(resp.data);
              }
             },function(resp) {
                // This block execute in case of error.
          });
      };

    $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.company.images[index]);
        $scope.company.images.splice(index,1);
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
                   $scope.company.images = $scope.ImagePath;
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
.controller('UpdatecompanyCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, companyList){
    $scope.company = {images:[]};
    $scope.company = companyList;
     $scope.deleteImages = [];

    $scope.removeChoice1 = function(index){
        $scope.deleteImages.push($scope.company.images[index]);
        $scope.company.images.splice(index,1);
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
                    $scope.company.images.push(item.path);
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

    $scope.UpdateCompany = function(company) {
    company.delete_images = $scope.deleteImages;
    APIService.updateData({
          req_url: url + 'api/updateCompanyEquipment',
          data: company
      }).then(function(resp) {
          if(resp.data) {
             ngDialog.open({ template: 'partials/update.html', className: 'ngdialog-theme-default' });
            $uibModalInstance.close(resp.data);
          }else{
            $uibModalInstance.close(resp.data);
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

.controller('DeleteCompanyCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, companyList){
    $scope.delete = function () {
        APIService.removeData({
            req_url: url + 'api/removeCompanyEquipment',
            data: companyList
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