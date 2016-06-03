angular.module('admin.controllers', [])


.controller('AdminCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage) {
	// $rootScope.activeState = 'home';
	var islogin = $localstorage.get('islogin');
	  if(islogin!=1){
	     $state.go("login");
	  }
  
	$scope.logout = function(){
       $localstorage.set('islogin', "0");
	   $state.go("login");
	}

	$scope.compose = function(){
	    $state.go('mailMenu.compose');
	}
})