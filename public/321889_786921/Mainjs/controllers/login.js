angular.module('login.controllers', [])

.controller('LoginCtrl', function($scope, APIService, $localstorage, $state) {
    $scope.allvalue = true;
    var islogin = $localstorage.get('islogin');
    if(islogin==1){
       $state.go("admin.home");
    }

    $scope.forgetpassword = function(){
        $scope.allvalue = false;
    }
    $scope.gotologin = function(){
        $scope.allvalue = true;
    }
	$scope.login = function(productObj) {
        APIService.setData({
            req_url: 'http://52.39.156.51:8000/api/adminLogin',
            data: productObj
        }).then(function(resp) {
          if(resp.data.message=="success") {
                $localstorage.set('islogin', "1");
            	$state.go("admin.home");
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
    $scope.resetpassword = function() {
         APIService.setData({
            req_url: 'http://52.39.156.51:8000/api/forgotAdminPassword',
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