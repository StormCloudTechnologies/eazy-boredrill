
angular.module('ViewMail.controllers', [])

.controller('ViewMailCtrl', function($scope, $state, APIService, ngDialog, $localstorage, $uibModal) {
   
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }

   var statusmail = localStorage.getItem("statusmail");
   if(localStorage.getItem("viewMail")) {
      $scope.mail = JSON.parse(localStorage.getItem("viewMail"));
  }

  $scope.ReplyMsg = function() {
      var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/replyMsg.html',
          controller: 'ReplyCtrl',
          size: 'lg'
      });
    modalInstance.result.then(function () {
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  }

   $scope.viewmailList = [];
   $scope.deleteMsg = function(mail){
    $scope.viewmailList.push(mail._id)
    if(statusmail == "inbox"){
         APIService.updateData({
            req_url: url + 'api/updateMail',
            data: {updateMailList: $scope.viewmailList,status:'TRASH'}
        }).then(function(resp) {
            if(resp.data.message="Updated successfully.") {
                // $scope.mails = resp.data;
                ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                $state.go('mailMenu.mail');
            }
            else {
                $scope.mails = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
     }
     if(statusmail == "sent"){
         APIService.updateData({
            req_url: url + 'api/updateMail',
            data: {updateMailList: $scope.viewmailList,status:'TRASH'}
        }).then(function(resp) {
            if(resp.data.message="Updated successfully.") {
                // $scope.mails = resp.data;
                ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                $state.go('mailMenu.sendMail');
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
            req_url: url + 'api/deleteMail',
            data:  {deleteMailList: $scope.viewmailList}
        }).then(function(resp) {
            if(resp.data.length>=0) {
                // $scope.mails = resp.data;
                ngDialog.open({ template: 'deleteConfirmation.html', className: 'ngdialog-theme-default' });
                 $state.go('mailMenu.deleteMail');
            }
            else {
                $scope.mails = [];
            }
           },function(resp) {
              // This block execute in case of error.
        });
     }
 }
})
.controller('ReplyCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, ngDialog, $state){
    $scope.replyMail = function(message) {
      var statusmail = localStorage.getItem("statusmail");
       if(localStorage.getItem("viewMail")) {
          $scope.mail = JSON.parse(localStorage.getItem("viewMail"));
      }
      APIService.setData({
          req_url: url + 'api/sendCustomMail',
          data : {to: $scope.mail.email, subject: 'Boredrill Reply' ,message: message }
      }).then(function(resp) {
          if(resp.data.message="Message sent successfully.") {
              ngDialog.open({ template: 'sendmailsucess.html', className: 'ngdialog-theme-default' });
              $state.go('mailMenu.mail');
              $uibModalInstance.close(resp.data);
          }
          else {
              $uibModalInstance.close(resp.data);
              $scope.mails = [];
          }
         },function(resp) {
            // This block execute in case of error.
      });
   }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});