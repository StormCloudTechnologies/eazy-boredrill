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
.directive('dynamic', function ($compile) {
    return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
      ele.html(html);
      $compile(ele.contents())(scope);
      });
    }
    };
  })
.controller('DeleteMailCtrl', function($scope, APIService) {
   
   $scope.compose = function(){
      window.location = "compose.html";
   }
   $scope.ViewMail = function(mail, statusmail){
      localStorage.setItem("statusmail",statusmail);
      localStorage.setItem("viewMail",JSON.stringify(mail));
      window.location = "viewmail.html";
   }
   $scope.gettrashMails = function() {
      APIService.setData({
          req_url: url_prifix + 'api/getMails',
          data: {status: 'TRASH'}
      }).then(function(resp) {
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
   $scope.gettrashMails();
  $scope.mail = {};
   $scope.mail.checked = false;
   $scope.allcheck = false;
   $scope.deleteMailList = [];
   $scope.checkAllmaildata = function(){
        angular.forEach($scope.mails, function (item) {
            item.checked = $scope.allcheck;
            if($scope.allcheck)
            $scope.deleteMailList.push(item._id);
            else
             $scope.deleteMailList = []; 
        });

      
   }

   $scope.checksinglemail = function(updatecheckId){
      console.log(updatecheckId);
      angular.forEach($scope.mails, function (item) {
         if(item.checked==true){
            console.log("push");
            $scope.deleteMailList.push(updatecheckId);
         }
         if(item.checked==false){
          console.log("splice");
          $scope.deleteMailList.splice(updatecheckId);
         }
         
      });
   }
     $scope.deleteAllMsg = function(){
          APIService.removeData({
              req_url: url_prifix + 'api/deleteMail',
              data: {deleteMailList: $scope.deleteMailList}
          }).then(function(resp) {
              console.log(resp);
              if(resp.data.message="Updated successfully.") {
                  // $scope.mails = resp.data;
                  // ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                 window.location = "deletemail.html";
              }
              else {
                  $scope.mails = [];
              }
             },function(resp) {
                // This block execute in case of error.
          });
       
     }
});