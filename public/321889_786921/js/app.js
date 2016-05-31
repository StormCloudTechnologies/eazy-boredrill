angular.module('eazyBoredrill', ['ui.router', 'APIModule', 'ngFileUpload', 'tc.chartjs', 'ui.bootstrap','admin.controllers','home.controllers', 'ProjectList.controllers'])


.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]).factory('genericInterceptor', function($q, $rootScope) {
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

.run(function($rootScope, $state){
    $state.transitionTo('admin.home');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('admin', {
    url: '/admin',
    abstract: true,
    templateUrl: 'partials/admin.html',
    controller: 'AdminCtrl'
  })

.state('admin.home', {
    url: '/home',
    views: {
      'container': {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
.state('admin.projectlist', {
    url: '/projectlist',
    views: {
      'container': {
        templateUrl: 'partials/projectlist.html',
        controller: 'ProjectListCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  });
});