angular.module('main.controllers', [])
.controller('AppCtrl', function($scope, $localstorage, $rootScope) {
  
  $rootScope.activeState = 'home';
 
 	// $scope.CategoryName = $localstorage.get('CategoryName')
 	// if($scope.CategoryName=='' || $scope.CategoryName==undefined){
 	//   
 	// }else{
 	//    $scope.activeState = $scope.CategoryName;
 	// }
 	

})