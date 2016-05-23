angular.module('starter', ['APIModule'])
.controller('LoginCtrl', function($scope, APIService) {
    $scope.allvalue = true;
    $scope.forgetpassword = function(){
        $scope.allvalue = false;
    }
    $scope.gotologin = function(){
        $scope.allvalue = true;
    }
	$scope.login = function(productObj) {
        // window.location = "home.html";
		 APIService.setData({
            req_url: 'http://localhost:8000/api/adminLogin',
            data: productObj
        }).then(function(resp) {
          if(resp.data.message=="success") {
            	window.location = "home.html";
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
    $scope.resetpassword = function() {
         APIService.setData({
            req_url: 'http://localhost:8000/api/forgotAdminPassword',
            data: ''
        }).then(function(resp) {
            console.log(resp);
            if(resp.data.successMessage=="Credentials has been sent to your Email.") {
                $scope.allvalue = true;
            }else{
                alert(resp.data.message);
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
});