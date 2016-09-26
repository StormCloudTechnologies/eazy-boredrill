angular.module('about.controllers', [])
.controller('AboutCtrl', function($scope, $rootScope, $state, APIService) {
  $rootScope.activeState = 'about';
  $scope.aboutUsObj = {};
  $scope.getAbout = function() {
     APIService.getData({
            req_url: url_prifix + 'api/getAboutUs'
        }).then(function(resp) {
            console.log(resp);
             if(resp.data.length!=0) {
              $scope.aboutUsObj = resp.data[0];
             }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getAbout();
})