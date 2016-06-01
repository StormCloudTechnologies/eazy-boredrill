angular.module('Compose.controllers', [])

.controller('ComposeCtrl', function($scope, $state, APIService, Upload, $uibModal, $localstorage) {
	
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }
 

  $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };
  $scope.searchEmailIds = function (search_value) {
        return APIService.setData({
            req_url: url + 'api/getEmailIds',
            data: {
                email_search: search_value
            }
        }).then(function(resp) {
            return resp.data;
        },function(resp) {
        });
    };
  $scope.toggleDropdown = function($event) {
    $event.preventDefault();
    $event.stopPropagation();
    $scope.status.isopen = !$scope.status.isopen;
  };

  $scope.appendToEl = angular.element(document.querySelector('#dropdown-long-content'));


    $scope.compose = {images:[]};
    $scope.inputMessage = "";
    $scope.editerdata = function(){
      console.log($scope.inputMessage);
    }

    $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.compose.images[index]);
        $scope.compose.images.splice(index,1);
    };
    $scope.ImagePath = [];  
    $scope.uploadPhoto = function(file) {
        file.upload = Upload.upload({
          url: url + 'api/uploadPhotos',
          arrayKey: '',
          data: {file: file}
        });

        file.upload.then(function (response) {
           console.log(response);
           if(response.data.length > 0) {
                angular.forEach(response.data, function(item){
                   $scope.compose.images.push(item.path);
                   // $scope.project.images = $scope.ImagePath;
                });
             }
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };

     $scope.sendMail = function(To, subject, images, editerdata) {
      APIService.setData({
          req_url: url + 'api/sendCustomMail',
          data : {to: To, subject: subject ,message: editerdata, images : images }
      }).then(function(resp) {
          if(resp.data) {
              $state.go('mailMenu.sendMail');
          }
          else {
              $scope.mails = [];
          }
         },function(resp) {
            // This block execute in case of error.
      });
   }

})