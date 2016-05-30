var url_prifix = 'http://localhost:8000/';
angular.module('mailModule', ['APIModule'])
.factory('genericInterceptor', function($q, $rootScope) {
    var interceptor = {
        'request': function(config) {
            // Successful request method
            $rootScope.loadCompetition = true;
            return config; // or $q.when(config);
        },
        'response': function(response) {
            // Successful response
            $rootScope.loadCompetition = false;
            return response; // or $q.when(config);
        },
        'requestError': function(rejection) {
            // An error happened on the request
            // if we can recover from the error
            // we can return a new request
            // or promise
            $rootScope.loadCompetition = false;
            return response;
            // Otherwise, we can reject the next
            // by returning a rejection
            // return $q.reject(rejection);
        },
        'responseError': function(rejection) {
            
            // Returning a rejection
            $rootScope.loadCompetition = false;
            return rejection;
        }
    };
    return interceptor;
})
.controller('SendMailCtrl', function($scope, APIService) {
   
   $scope.compose = function(){
      window.location = "compose.html";
   }
   $scope.ViewMail = function(mail, statusmail){
     localStorage.setItem("statusmail",statusmail);
     localStorage.setItem("viewMail",JSON.stringify(mail));
      window.location = "viewmail.html";
   }
   $scope.getMails = function() {
     APIService.setData({
          req_url: url_prifix + 'api/getMails',
          data: {status: 'SENT'}
      }).then(function(resp) {
          console.log(resp);
          if(resp.data.length > 0) {
              $scope.mails = resp.data;
          }
          else {
              $scope.mails = [];
          }
         },function(resp) {
            // This block execute in case of error.
      });
   }
   $scope.getMails();
});