angular.module('Faq.controllers', [])


.controller('FaqCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
	  $rootScope.activeState = 'faq';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }

  $scope.oneAtATime = true;
	$scope.no_product = true;
  $scope.Faqlists = [];
  $scope.getFaq = function() {
     APIService.getData({
            req_url: url + 'api/getFAQ'
        }).then(function(resp) {
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.Faqlists = resp.data;

            }else{
              $scope.no_product = true;
              $scope.Faqlists = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getFaq();

  //log
  $scope.$watch('isOpen', function(){
   }, true);
 
    $scope.AddFaq = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/AddFaq.html',
            controller: 'AddFaqCtrl',
            size: 'lg'
        });
      modalInstance.result.then(function (FaqData) {
          if(FaqData.length != 0) {
                $scope.no_product = false;
                $scope.Faqlists = FaqData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.Faqlists = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }

    $scope.updateFAQlist = function(Data) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updateFaq.html',
            controller: 'UpdateFaqCtrl',
            size: 'lg',
            resolve: {
                faqList: function () {
                    return Data;
                }
            }
        });
      modalInstance.result.then(function (FaqData) {
          if(FaqData.length != 0) {
                $scope.no_product = false;
                $scope.Faqlists = FaqData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.Faqlists = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }
 

    $scope.deleteProject = function(FaqData) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteFaqCtrl',
            size: 'sm',
            resolve: {
                faqList: function () {
                    return FaqData;
                }
            }
        });
        modalInstance.result.then(function (FaqData) {
            if(FaqData.length != 0) {
                $scope.no_product = false;
                $scope.Faqlists = FaqData;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.Faqlists = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
 
   

}).controller('AddFaqCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
    $scope.project = {images:[]};
    $scope.AddFaq = function(Faqlist) {
     APIService.setData({
          req_url: url + 'api/addFAQ',
          data: Faqlist
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
.controller('UpdateFaqCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, faqList){
    $scope.project = {images:[]};
    $scope.Faqlist = faqList;

    $scope.UpdateProject = function(FaqList) {
     APIService.updateData({
          req_url: url + 'api/updateFAQ',
          data:  FaqList
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
.controller('DeleteFaqCtrl', function ($scope, $state, $rootScope, $uibModalInstance, APIService, faqList){
    
    $scope.delete = function () {
        APIService.removeData({
            req_url: url + 'api/removeFAQ',
            data: faqList
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