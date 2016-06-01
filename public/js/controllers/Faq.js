angular.module('Faq.controllers', [])


.controller('FaqCtrl', function($scope, $state, APIService, $localstorage) {
	 
  $scope.oneAtATime = true;
	$scope.no_product = true;
  $scope.Faqlists = [];
  $scope.getFaq = function() {
     APIService.getData({
            req_url: url_prifix + 'api/getFAQ'
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
 
 
});