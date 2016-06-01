
angular.module('DeleteMail.controllers', [])


.controller('DeleteMailCtrl', function($scope, APIService, $state, $localstorage) {
   
   var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }
  
   $scope.ViewMail = function(mail, statusmail){
      localStorage.setItem("statusmail",statusmail);
      localStorage.setItem("viewMail",JSON.stringify(mail));
      $state.go('mailMenu.viewMail');
   }
   $scope.gettrashMails = function() {
      APIService.setData({
          req_url: url + 'api/getMails',
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
              req_url: url + 'api/deleteMail',
              data: {deleteMailList: $scope.deleteMailList}
          }).then(function(resp) {
              console.log(resp);
              if(resp.data.message="Updated successfully.") {
                  // $scope.mails = resp.data;
                  // ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                 $state.go('mailMenu.deleteMail');
              }
              else {
                  $scope.mails = [];
              }
             },function(resp) {
                // This block execute in case of error.
          });
       
     }
});