angular.module('Faq.controllers', [])


.controller('FaqCtrl', function($scope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
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
          console.log(resp);
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
        console.log(" watch isOpen:" +$scope.isOpen);
   }, true);
 
    $scope.editFaq = function() {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/AddFaq.html',
            controller: 'AddFaqCtrl',
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

    $scope.updateFAQlist = function(Data) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updateFaq.html',
            controller: 'UpdateFaqCtrl',
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
 

    $scope.deleteProject = function(FaqData) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteConfirmationCtrl',
            size: 'sm',
            resolve: {
                product: function () {
                    return FaqData;
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
 
   

}).controller('AddFaqCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
    $scope.project = {images:[]};
    $scope.AddFaq = function(Faqlist) {
     APIService.setData({
          req_url: url + 'api/addFAQ',
          data: Faqlist
      }).then(function(resp) {
        console.log(resp);
          if(resp.data.message=="FAQ has been added successfully.") {
            ngDialog.open({ template: 'partials/sucess.html', className: 'ngdialog-theme-default' });
            $state.go('admin.Faq');
            setTimeout(function() {
              
              $uibModalInstance.close(resp.data);
            }, 100);
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
            setTimeout(function() {
              $state.go('admin.Faq');
              $uibModalInstance.close(resp.data);
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
.controller('UpdateFaqCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, product){
    $scope.project = {images:[]};
    $scope.Faqlist = product;

    $scope.UpdateProject = function(project) {
     APIService.updateData({
          req_url: url + 'api/updateFAQ',
          data: {projectData: project}
      }).then(function(resp) {
        console.log(resp);
          if(resp.data.message=="Updated successfully.") {
            ngDialog.open({ template: 'partials/update.html', className: 'ngdialog-theme-default' });
             $state.go('admin.Faq');
          }else{
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
             $state.go('admin.Faq');
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
})
.controller('DeleteConfirmationCtrl', function ($scope, $state, $rootScope, $uibModalInstance, APIService, product){
    $scope.delete = function () {
        APIService.removeData({
            req_url: url + 'api/removeFAQ',
            data: product
        }).then(function(resp) {
            $state.go('admin.Faq');
            $uibModalInstance.close(resp.data);
           },function(resp) {
              // This block execute in case of error.
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});