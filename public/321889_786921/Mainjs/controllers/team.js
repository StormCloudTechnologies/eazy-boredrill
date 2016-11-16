angular.module('Team.controllers', [])

.controller('TeamCtrl', function($scope, $rootScope, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, $log) {
    $rootScope.activeState = 'Team';
    var islogin = $localstorage.get('islogin');
    if(islogin!=1){
       $state.go("login");
    }

  $scope.teamlist = [];
  $scope.no_product = true;

  $scope.getTeam = function() {
     APIService.setData({
            req_url: url + 'api/getOurTeam',
        }).then(function(resp) {
            console.log(resp);
            if(resp.data.length!=0) {
              $scope.no_product = false;
              $scope.teamlist = resp.data;
            }else{
               $scope.no_product = true;
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getTeam();

  $scope.addTeam = function() {
      var modalInstance = $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'partials/addteam.html',
          controller: 'AddTeamCtrl',
          size: 'lg'
        });
      modalInstance.result.then(function (teamData) {
          if(teamData.length != 0) {
                $scope.teamlist = teamData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.teamlist = [];
                $scope.no_product = true;
            }
    }, function () {
      // $log.info('Modal dismissed at: ' + new Date());
    });

    $scope.toggleAnimation = function () {
      $scope.animationsEnabled = !$scope.animationsEnabled;
    };
  }

    $scope.updateTeamList = function(Data) {
        // $scope.project = Data;
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/updateteam.html',
            controller: 'UpdateTeamCtrl',
            size: 'lg',
            resolve: {
                teamList: function () {
                    return Data;
                }
            }
        });
      modalInstance.result.then(function (teamData) {
          if(teamData.length != 0) {
                $scope.teamlist = teamData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.teamlist = [];
                $scope.no_product = true;
            }
      }, function () {
        // $log.info('Modal dismissed at: ' + new Date());
      });
  
      $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
      };
    }
 


 
    $scope.deleteTeam = function(team) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'partials/deleteConfirmation.html',
            controller: 'DeleteConfirmationCtrl',
            size: 'sm',
            resolve: {
                teamList: function () {
                    return team;
                }
            }
        });
        modalInstance.result.then(function (teamData) {
            if(teamData.length != 0) {
                $scope.teamlist = teamData;
                 $scope.no_product = false;
                // ngDialog.open({ template: 'partials/popupdelete.html', className: 'ngdialog-theme-default' });
            }
            else {
                $scope.teamlist = [];
                $scope.no_product = true;
            }
          }, function () {
      });
       
    }
 
    

})
.controller('AddTeamCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog){
     $scope.team = {images:[]};
      $scope.addTeam = function(team) {
        console.log(team);
        team.delete_images = $scope.deleteImages;
         APIService.setData({
              req_url: url + 'api/addOurTeam',
              data: team
          }).then(function(resp) {
              if(resp.data) {
                ngDialog.open({ template: 'partials/sucess.html', className: 'ngdialog-theme-default' });
                $uibModalInstance.close(resp.data);
              }else{
                ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
                $uibModalInstance.close(resp.data);
              }
             },function(resp) {
                // This block execute in case of error.
          });
      };

    $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.team.images[index]);
        $scope.team.images.splice(index,1);
    };
    $scope.ImagePath = [];  
    $scope.uploadPhoto = function(file) {
        file.upload = Upload.upload({
          url: url + 'api/uploadPhotos',
          arrayKey: '',
          data: {file: file}
        });

        file.upload.then(function (response) {
           if(response.data.length > 0) {
                angular.forEach(response.data, function(item){
                   $scope.ImagePath.push(item.path);
                   console.log($scope.ImagePath);
                   $scope.team.images = $scope.ImagePath;
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
  $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('UpdateTeamCtrl', function ($scope, $uibModalInstance, $state, APIService, Upload, $uibModal, $localstorage, ngDialog, teamList){
    $scope.team = {images:[]};
    $scope.team = teamList;
    $scope.deleteImages = [];

    $scope.removeChoice1 = function(index){
        $scope.deleteImages.push($scope.team.images[index]);
        $scope.team.images.splice(index,1);
    };
    $scope.uploadPhoto1 = function(file) {
        file.upload = Upload.upload({
          url: url + 'api/uploadPhotos',
          arrayKey: '',
          data: {file: file}
        });

        file.upload.then(function (response) {
           if(response.data.length > 0) {
                angular.forEach(response.data, function(item){
                    $scope.team.images.push(item.path);
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

    $scope.updateTeam= function(team) {
    team.delete_images = $scope.deleteImages;
    APIService.updateData({
          req_url: url + 'api/updateLatestJob',
          data: team
      }).then(function(resp) {
          if(resp.data) {
             ngDialog.open({ template: 'partials/update.html', className: 'ngdialog-theme-default' });
            $uibModalInstance.close(resp.data);
          }else{
            $uibModalInstance.close(resp.data);
            ngDialog.open({ template: 'partials/error.html', className: 'ngdialog-theme-default' });
           
          }
         },function(resp) {
            // This block execute in case of error.
      });
  };
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };
})

.controller('DeleteConfirmationCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, teamList){
    $scope.delete = function (team) {
        APIService.removeData({
            req_url: url + 'api/removeOurTeam',
            data: teamList
        }).then(function(resp) {
            $uibModalInstance.close(resp.data);
           },function(resp) {
              // This block execute in case of error.
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});