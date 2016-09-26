angular.module('About.controllers', [])


.controller('AboutCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
	 $rootScope.activeState = 'about';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }
  $scope.aboutUsObj = {};
  $scope.getAbout = function() {
     APIService.getData({
            req_url: url + 'api/getAboutUs'
        }).then(function(resp) {
           if(resp.data.length!=0) {
              $scope.aboutUsObj = resp.data[0];
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getAbout();

  //log
  $scope.$watch('isOpen', function(){
   }, true);
 


    $scope.addAbout = function(AboutData,key) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/AddAbout.html',
            controller: 'AddAboutCtrl',
            size: 'lg',
             resolve: {
                AboutData: function () {
                    return AboutData;
                },
                key: function () {
                    return key;
                }
            }
        });
      modalInstance.result.then(function (AboutData) {
          if(AboutData.length != 0) {
               $scope.aboutData = AboutData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.aboutData = [];
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }

    $scope.updateAboutlist = function(AboutData, key) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/UpdateAbout.html',
            controller: 'UpdateAboutCtrl',
            size: 'lg',
            resolve: {
                AboutData: function () {
                    return AboutData;
                },
                key: function () {
                    return key;
                }
            }
        });
       modalInstance.result.then(function (AboutData) {
          if(AboutData.length != 0) {
                $scope.no_product = false;
                $scope.aboutList = AboutData;
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
 

   

}).controller('AddAboutCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, AboutData, key){
  $scope.aboutData = AboutData;

    $scope.addAbout = function(value) {
      $scope.aboutData[key] = value;
     APIService.setData({
          req_url: url + 'api/updateAboutUs',
          data: $scope.aboutData
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
.controller('UpdateAboutCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, AboutData, key){
    $scope.aboutlist= {};
    $scope.aboutData = AboutData;
    $scope.aboutlist.description = $scope.aboutData[key];
    $scope.updateAbout = function(value) {
     $scope.aboutData[key] = value;
     APIService.setData({
          req_url: url + 'api/updateAboutUs',
          data: $scope.aboutData
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
