var url_prifix = 'http://52.39.156.51:8000/';

angular.module('contactModule', ['APIModule'])

.controller('ContactCtrl', function($scope, APIService) {
    $scope.submitted = false;
    $scope.sendEmail = function(mail) {
        if(mail && (mail.name != null && mail.name != '' && mail.name != undefined) && (mail.email != null && mail.email != '' && mail.email != undefined) && (mail.phone != null && mail.phone != '' && mail.phone != undefined) && (mail.message != null && mail.message != '' && mail.message != undefined))
        {
          console.log("====aaya======");
            APIService.setData({
                req_url: url_prifix + 'api/sendMail',
                data: mail
            }).then(function(resp) {
                $scope.submitted = false;
                $scope.successMessage = resp.data.message;
                $scope.mail.name = '';
                $scope.mail.email = '';
                $scope.mail.phone = '';
                $scope.mail.message = '';
                $scope.contactform.$setPristine();
               },function(resp) {
                  // This block execute in case of error.
            });
        }
    };
});