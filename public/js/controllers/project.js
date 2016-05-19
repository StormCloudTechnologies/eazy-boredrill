angular.module('starter', ['ui.bootstrap'])
.controller('ProjectCtrl', function($scope, $uibModal) {
  
  $scope.ProjectLists = [
  	{
  		"name":"Central Hospital",
  		'image':'images/projects/project1.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 November 2016, 12:20 AM'
  	},
  	{
  		"name":"Construction CEO",
  		'image':'images/projects/project2.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'18 November 2015, 12:20 AM'
  	},
  	{
  		"name":"Workder Accessories",
  		'image':'images/projects/project3.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'15 November 2016, 01:20 AM'
  	},
  	{
  		"name":"Construction CEO",
  		'image':'images/projects/project2.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 April 2016, 12:20 AM'
  	},
  	{
  		"name":"Workder Accessories",
  		'image':'images/projects/project3.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 March 2016, 12:20 AM'
  	},
  	{
  		"name":"Central Hospital",
  		'image':'images/projects/project1.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 June 2016, 12:20 AM'
  	},{
  		"name":"Central Hospital",
  		'image':'images/projects/project1.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 March 2016, 12:20 AM'
  	},
  	{
  		"name":"Construction CEO",
  		'image':'images/projects/project2.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 June 2016, 12:20 AM'

  	},
  	{
  		"name":"Workder Accessories",
  		'image':'images/projects/project3.png',
  		'type':'This year in our 2014 roadmap one of our goals was to improve financial tooling for authors. A big part of that is the withdrawal cycle.',
      'date':'16 June 2016, 12:20 AM'
  	}
  ];

   $scope.Project = function () {
    var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'ProjectSlider.html',
        controller: 'ProjectSliderCtrl',
        size: 'md'
      });
  };

})
.controller('ProjectSliderCtrl', function($scope, $uibModalInstance) {
  $scope.myInterval = 5000;
  $scope.active_slide = 0;
  console.log("slide");
  $scope.ImageSliders = [
    {
      'image':'images/blog/blog1.png'
    },{
      'image':'images/blog/blog2.png'
    },{
      'image':'images/blog/blog3.png'
    },{
      'image':'images/blog/blog1.png'
    }
  ];
   $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
});