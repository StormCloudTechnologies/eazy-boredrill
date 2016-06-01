
angular.module('SendMail.controllers', [])


.controller('SendMailCtrl', function($scope, $state, APIService, $state, $localstorage) {
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }
   
   $scope.ViewMail = function(mail, statusmail){
     localStorage.setItem("statusmail",statusmail);
     localStorage.setItem("viewMail",JSON.stringify(mail));
     $state.go('mailMenu.viewMail');
   }
   $scope.getMails = function() {
     APIService.setData({
          req_url: url + 'api/getMails',
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
      console.log(updatecheckId);
      angular.forEach($scope.mails, function (item) {
         if(item.checked==true){
            console.log("push");
            $scope.updateMailList.push(updatecheckId);
         }
         if(item.checked==false){
          console.log("splice");
          $scope.updateMailList.splice(updatecheckId);
         }
         
      });
   }


    $scope.deleteAllMsg = function(){
             APIService.updateData({
                  req_url: url + 'api/updateMail',
                  data: {updateMailList: $scope.updateMailList,status:'TRASH'}
              }).then(function(resp) {
                  console.log(resp);
                  if(resp.data) {
                    $scope.getMails();
                  }
                  else {
                      $scope.mails = [];
                  }
                 },function(resp) {
                    // This block execute in case of error.
              });
       
     }
});