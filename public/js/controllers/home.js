angular.module('starter', ['APIModule', 'ui.bootstrap'])
.controller('homeCtrl', function($scope, APIService, $uibModal) {
  
  $scope.ProjectLists = [];
  $scope.getProject = function() {
     APIService.setData({
            req_url: 'http://52.39.156.51:8000/api/getLatestJobs',
            data: {projectData:{}}
        }).then(function(resp) {
          console.log(resp);
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.ProjectLists = resp.data;
            }else{
              $scope.no_product = true;
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getProject();

 
   $scope.Project = function (Projectdata) {
    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'ProjectSlider.html',
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
  console.log("slide");
  $scope.ImageSliders = [];
  console.log(product.images);
  $scope.ImageSliders= product.images;
  $scope.projectTilte = product.project_name;
  $scope.projectDiscrition = product.project_description;
 
   $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});