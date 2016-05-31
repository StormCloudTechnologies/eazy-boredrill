angular.module('admin.controllers', [])


.controller('AdminCtrl', function($scope, APIService, Upload, $uibModal, $localstorage) {
	var islogin = $localstorage.get('islogin');
	  if(islogin!=1){
	      window.location = "index.html";
	  }
  
	$scope.logout = function(){
       $localstorage.set('islogin', "0");
	   window.location = "index.html";
	}
})