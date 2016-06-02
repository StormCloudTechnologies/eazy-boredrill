angular.module('contact.controllers', [])

.controller('ContactCtrl', function($scope, APIService, $rootScope) {

    $rootScope.activeState = 'contact';
    $scope.submitted = false;
    $scope.sendEmail = function(mail) {
        if(mail && (mail.name != null && mail.name != '' && mail.name != undefined) && (mail.email != null && mail.email != '' && mail.email != undefined) && (mail.phone != null && mail.phone != '' && mail.phone != undefined) && (mail.message != null && mail.message != '' && mail.message != undefined))
        {
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

    function initMap() {
      var myLatLng = {lat: 18.5624670, lng: 73.7726630};

      var map = new google.maps.Map(document.getElementById('MapContact'), {
        zoom: 15,
        center: myLatLng
      });

      var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
      });
    }
    initMap();
});