angular.module('projects.controllers', [])


.controller('ProjectCtrl', function($scope, APIService, $uibModal, $rootScope) {
  $rootScope.activeState = 'project';
  $scope.activeClass = function(name){
      
  }

  $scope.ProjectLists = [];
  $scope.getProject = function() {
     APIService.setData({
            req_url: url_prifix+'api/getProjects',
            data: {projectData:{}}
        }).then(function(resp) {
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
        templateUrl: 'public/partials/ProjectSlider.html',
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
  $scope.projectTilte = product.project_name;
  $scope.projectDiscrition = product.project_description;
 
   $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});