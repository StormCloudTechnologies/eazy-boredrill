angular.module('starter', ['APIModule', 'ui.bootstrap'])
.factory('genericInterceptor', function($q, $rootScope) {
    var interceptor = {
        'request': function(config) {
            // Successful request method
            $rootScope.loadCompetition = true;
            return config; // or $q.when(config);
        },
        'response': function(response) {
            // Successful response
            $rootScope.loadCompetition = false;
            return response; // or $q.when(config);
        },
        'requestError': function(rejection) {
            // An error happened on the request
            // if we can recover from the error
            // we can return a new request
            // or promise
            $rootScope.loadCompetition = false;
            return response;
            // Otherwise, we can reject the next
            // by returning a rejection
            // return $q.reject(rejection);
        },
        'responseError': function(rejection) {
            
            // Returning a rejection
            $rootScope.loadCompetition = false;
            return rejection;
        }
    };
    return interceptor;
})

.controller('ProjectCtrl', function($scope, APIService, $uibModal) {
  
  $scope.ProjectLists = [];
  $scope.getProject = function() {
     APIService.setData({
            req_url: 'http://52.39.156.51:8000/api/getProjects',
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