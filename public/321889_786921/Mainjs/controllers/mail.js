angular.module('Mail.controllers', [])

.controller('MailCtrl', function($scope, APIService,$state, $localstorage, $rootScope) {
    $rootScope.activeState = 'mail';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }
   
   $scope.ViewMail = function(mail,statusmail){
    // console.log(statusmail);
     localStorage.setItem("statusmail",statusmail);
     localStorage.setItem("viewMail",JSON.stringify(mail));
      $state.go('mailMenu.viewMail');
   }
   $scope.getMails = function() {
      APIService.setData({
          req_url: url + 'api/getMails',
          data: {status: 'INBOX'}
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
   $scope.getMails();

   $scope.mail = {};
   $scope.mail.checked = false;
   $scope.allcheck = false;
   $scope.updateMailList = [];
   $scope.checkAllmaildata = function(){
        angular.forEach($scope.mails, function (item) {
            item.checked = $scope.allcheck;
            if($scope.allcheck)
            $scope.updateMailList.push(item._id);
            else
             $scope.updateMailList = []; 
        });

      
   }

   $scope.checksinglemail = function(updatecheckId){
      angular.forEach($scope.mails, function (item) {
         if(item.checked==true){
            $scope.updateMailList.push(updatecheckId);
         }
         if(item.checked==false){
          $scope.updateMailList.splice(updatecheckId);
         }
         
      });
   }


    $scope.deleteAllMsg = function(){
     APIService.updateData({
          req_url: url + 'api/updateMail',
          data: {updateMailList: $scope.updateMailList,status:'TRASH'}
      }).then(function(resp) {
          if(resp.data) {
            $scope.getMails();
          }
          else {
              $scope.mails = [];
          }
         },function(resp) {
            // This block execute in case of error.
      });
        //     }            
        // })
        
     }
});