angular.module('starter', ['APIModule', 'ngFileUpload', 'ngDialog'])
.controller('ProjectCtrl', function($scope, APIService, Upload) {
  
	$scope.logout = function(){
	   window.location = "index.html";
	}
  $scope.projectlist = [];
  $scope.getProject = function() {
     APIService.setData({
            req_url: 'http://localhost:8000/api/getProjects',
            data: ''
        }).then(function(resp) {
          console.log(resp);
            if(resp.data.lenght!=0) {
              $scope.projectlist = resp.data;
            }
           },function(resp) {
              // This block execute in case of error.
        });
    };
  $scope.getProject();

	$scope.AddProject = function(productObj) {
		 APIService.setData({
            req_url: 'http://localhost:8000/api/addProject',
            data: productObj
        }).then(function(resp) {
        	console.log(resp);
            if(resp.data.message=="success") {
            	window.location = "home.html";
            }
           },function(resp) {
              // This block execute in case of error.
        });
  };

    $scope.deleteImages = [];
    $scope.removeChoice = function(image_path){
        $scope.deleteImages.push(image_path);
    };
    $scope.uploadPhoto = function(file) {
        file.upload = Upload.upload({
          url: url_prifix + 'api/uploadPhoto',
          data: {file: file},
        });

        file.upload.then(function (response) {
            console.log(response);
            if(response.data) {
                $scope.post.image_path = response.data.path;
            }
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };
})
.controller('DeleteConfirmationCtrl', function ($scope, $rootScope, $uibModalInstance, APIService, product, Flash, ngDialog){
    $scope.delete = function () {
        APIService.removeData({
            req_url: url_prifix + 'api/removeProduct',
            data: product
        }).then(function(resp) {
            $uibModalInstance.close(resp.data);
           },function(resp) {
              // This block execute in case of error.
        });
    }
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
})
.controller('UpdateAdCtrl', function($scope, $state, $stateParams, APIService, Upload) {
     $scope.exprince= false;
     $scope.usabilityhide = true;

    $scope.deleteImages = [];
    $scope.removeChoice = function(index){
        $scope.deleteImages.push($scope.post.images[index]);
        $scope.post.images.splice(index,1);
        
    };
    $scope.uploadPhotos = function(file) {
        var remainingLength = 8 - $scope.post.images.length;
        if(file.length <= remainingLength){
            file.upload = Upload.upload({
              url: url_prifix + 'api/uploadPhotos',
              arrayKey: '',
              data: {file: file},
            });

            file.upload.then(function (response) {
                if(response.data.length > 0) {
                    angular.forEach(response.data, function(item){
                        $scope.post.images.push(item.path);
                    });
                 }
            }, function (response) {
              if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
              // Math.min is to fix IE which reports 200% sometimes
              file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
        else{
           ngDialog.open({ template: 'partials/image.html', className: 'ngdialog-theme-default' });
        }
    }
    $scope.updateAd = function(post) {
      post.status = "PENDING";
        APIService.updateData({
              req_url: url_prifix + 'api/updateAd',
              data: {post: post, delete_images : $scope.deleteImages}
          }).then(function(resp) {
              if(resp.data.message) {
                  ngDialog.open({ template: 'partials/popupTmpl.html', className: 'ngdialog-theme-default' });
                  $state.go('app.myAccount');
                  /*var alertPopup = $ionicPopup.alert({
                     title: 'Ad Updated',
                     template: 'Your ad has been updated successfully.'
                   });
                   alertPopup.then(function(res) {
                       $state.go('app.myAccount');
                   });*/
              }
              else {

              }
             },function(resp) {
                // This block execute in case of error.
        });
    }
});