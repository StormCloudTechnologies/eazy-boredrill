angular.module('Services.controllers', [])


.controller('ServicesCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
	 $rootScope.activeState = 'services';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }

  $scope.oneAtATime = true;
	$scope.no_product = true;
  $scope.Serviceslists = [];
  $scope.getServices = function() {
     APIService.getData({
            req_url: url + 'api/getServices'
        }).then(function(resp) {
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.Serviceslists = resp.data;

            }else{
              $scope.no_product = true;
              $scope.Serviceslists = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getServices();

  //log
  $scope.$watch('isOpen', function(){
   }, true);
 
    $scope.AddServices = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/AddServices.html',
            controller: 'AddServicesCtrl',
            size: 'lg'
        });
      modalInstance.result.then(function (ServicesData) {
          if(ServicesData.length != 0) {
                $scope.no_product = false;
                $scope.Serviceslists = ServicesData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.Serviceslists = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }

    $scope.updateServiceslist = function(servicesData) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updateServices.html',
            controller: 'UpdateServicesCtrl',
            size: 'lg',
            resolve: {
                ServicesList: function () {
                    return servicesData;
                }
            }
        });
       modalInstance.result.then(function (ServicesData) {
          if(ServicesData.length != 0) {
                $scope.no_product = false;
                $scope.Serviceslists = ServicesData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.Serviceslists = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }
 

    $scope.deleteProject = function(servicesData) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteServicesCtrl',
            size: 'sm',
            resolve: {
                ServicesList: function () {
                    return servicesData;
                }
            }
        });
        modalInstance.result.then(function (ServicesData) {
          if(ServicesData.length != 0) {
                $scope.no_product = false;
                $scope.Serviceslists = ServicesData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.Serviceslists = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
 
   

}).controller('AddServicesCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
    $scope.AddServices = function(Serviceslist) {
     APIService.setData({
          req_url: url + 'api/addService',
          data: Serviceslist
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

  
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('UpdateServicesCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, ServicesList){
    $scope.Serviceslist = ServicesList;

    $scope.UpdateServices = function(Serviceslist) {
     APIService.updateData({
          req_url: url + 'api/updateService',
          data:  Serviceslist
      }).then(function(resp) {
          if(resp.data) {
            ngDialog.open({ template: 'partials/update.html', className: 'ngdialog-theme-default' });
            $uibModalInstance.close(resp.data);
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
              $uibModalInstance.close(resp.data);
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
})
.controller('DeleteServicesCtrl', function ($scope, $state, $rootScope, $uibModalInstance, APIService, ServicesList){
    
    $scope.delete = function () {
        APIService.removeData({
            req_url: url + 'api/removeService',
            data: ServicesList
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