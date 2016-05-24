angular.module('starter', [])

.controller('MailCtrl', function($scope) {
	 $scope.compose = function(){
      window.location = "compose.html";
   }
   $scope.ViewMail = function(){
      window.location = "viewmail.html";
   }
})