angular.module('Faq.controllers', [])


.controller('FaqCtrl', function($scope, $state, APIService, $localstorage, $rootScope) {
	 $rootScope.activeState = 'faq';
  $scope.oneAtATime = true;
	$scope.no_product = true;

  $scope.render = true;
  $scope.panelColor = 'panel-danger';

  $scope.setPanelColor = function(val) {
      if(val)
        return 'panel-active';
      else
        return  'panel-default';
  }

  $scope.getPanelColor = function() {
      return $scope.panelColor;
  };
   
  $scope.gotoactive = function(index){
    $scope.activeState = index;
  }

  $scope.Faqlists = [];
  $scope.getFaq = function() {
     APIService.getData({
            req_url: url_prifix + 'api/getFAQ'
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

  // $scope.checklike=function(status){
  //   if(status=='true' || status==true){
  //     return 'activeAcc';    
  //   }else{
  //     return 'panel-heading';
  //   } 
  // };

  //log
  $scope.$watch('isOpen', function(){
        // console.log(" watch isOpen:" +$scope.isOpen);
   }, true);
 
 
});