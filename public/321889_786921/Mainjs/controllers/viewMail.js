var url_prifix = 'http://localhost:8000/';
angular.module('mailModule', ['APIModule', 'ngDialog'])
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
.controller('ViewMailCtrl', function($scope, APIService, ngDialog) {
   $scope.compose = function(){
      window.location = "compose.html";
   }

   var statusmail = localStorage.getItem("statusmail");
   if(localStorage.getItem("viewMail")) {
      $scope.mail = JSON.parse(localStorage.getItem("viewMail"));
  }
   $scope.replyMail = function(message) {
      APIService.setData({
          req_url: url_prifix + 'api/sendCustomMail',
          data : {to: $scope.mail.email, subject: 'Boredrill Reply' ,message: message }
      }).then(function(resp) {
          if(resp.data.message="Message sent successfully.") {
              // $scope.mails = resp.data;
              ngDialog.open({ template: 'sendmailsucess.html', className: 'ngdialog-theme-default' });
              window.location = "viewMail.html";
          }
          else {
              $scope.mails = [];
          }
         },function(resp) {
            // This block execute in case of error.
      });
   }

   $scope.deleteMsg = function(mail){
    if(statusmail == "inbox"){
         mail.status = 'TRASH';
         APIService.updateData({
            req_url: url_prifix + 'api/updateMail',
            data: mail
        }).then(function(resp) {
            console.log(resp);
            if(resp.data.message="Updated successfully.") {
                // $scope.mails = resp.data;
                ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                window.location = "mail.html";
            }
            else {
                $scope.mails = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
     }
     if(statusmail == "sent"){
         mail.status = 'TRASH';
         APIService.updateData({
            req_url: url_prifix + 'api/updateMail',
            data: mail
        }).then(function(resp) {
            console.log(resp);
            if(resp.data.message="Updated successfully.") {
                // $scope.mails = resp.data;
                ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                window.location = "sendmail.html";
            }
            else {
                $scope.mails = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
     }
     if(statusmail == "trash"){
        APIService.removeData({
            req_url: url_prifix + 'api/deleteMail',
            data: mail
        }).then(function(resp) {
            console.log("=================resp==========",resp);
            if(resp.data.length>=0) {
                // $scope.mails = resp.data;
                ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                window.location = "deletemail.html";
            }
            else {
                $scope.mails = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
     }
 }
});