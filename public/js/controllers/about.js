angular.module('about.controllers', [])
.controller('AboutCtrl', function($scope, $rootScope, $state, APIService, $uibModal) {
  $rootScope.activeState = 'about';
  $scope.aboutUsObj = {};
   $scope.getTeam = function() {
     APIService.setData({
            req_url: url_prifix + 'api/getAboutUsForClient',
            // data:$scope.aboutUsObj
        }).then(function(resp) {
            console.log(resp);
             if(resp.data.length!=0) {
              $scope.aboutUsObj = resp.data.aboutUs[0];
              $scope.ourTeam = resp.data.ourTeam;
              $scope.ourCompany = resp.data.companyEquipment;
             }
           },function(resp) {
              // This block execute in case of error.
        });
  };
   $scope.getTeam();


  $scope.aboutView = function (Projectdata) {
    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'partials/projectSlider.html',
        controller: 'ProjectSliderCtrl',
        size: 'md',
          resolve: {
              product: function () {
                  return Projectdata;
              }
          }
      });
  };

})
.controller('ProjectSliderCtrl', function($scope, $uibModalInstance,product) {

  $scope.myInterval = 5000;
  $scope.active_slide = 0;
  $scope.ImageSliders = [];
  $scope.ImageSliders= product.images;
  $scope.projectTilte = product.title;
  $scope.projectDiscrition = product.description;
 
   $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});