var url_prifix = 'http://162.243.71.65:8000/';
// var url_prifix = 'http://localhost:8000/';

angular.module('eazyBoredrillWebiste', ['ui.router', 'APIModule', 'ui.bootstrap','main.controllers','home.controllers','services.controllers','projects.controllers','contact.controllers','about.controllers','Faq.controllers'])

.config(function($httpProvider) {
    $httpProvider.interceptors.push('genericInterceptor');
})

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
}])
.directive('niceScroll', function() {
    return{
        restrict: 'A',
        link: function(scope, element, attribute) {

            var nicescrolConf = {
                "cursorcolor": "#bdbdbd",
                "background": "#ffffff",
                "cursorwidth": "10px",
                "cursorborder": "none",
                "cursorborderradius": "2px",
                "zindex": 9999,
                "autohidemode": false
            };

           element.niceScroll(nicescrolConf);
        }
    };
})
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

.run(function($rootScope, $state){
    $state.transitionTo('app.home');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'partials/main.html',
    controller: 'AppCtrl'
  })

.state('app.home', {
    url: '/home',
    views: {
      'container': {
        templateUrl: 'partials/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
.state('app.projects', {
    url: '/projects',
    views: {
      'container': {
        templateUrl: 'partials/projects.html',
        controller: 'ProjectCtrl'
      }
    }
  })
.state('app.services', {
    url: '/services',
    views: {
      'container': {
        templateUrl: 'partials/services.html',
        controller: 'ServicesCtrl'
      }
    }
  })
.state('app.contact', {
    url: '/contact',
    views: {
      'container': {
        templateUrl: 'partials/contact.html',
        controller: 'ContactCtrl'
      }
    }
  })
.state('app.Faq', {
    url: '/Faq',
    views: {
      'container': {
        templateUrl: 'partials/Faq.html',
        controller: 'FaqCtrl'
      }
    }
  })
.state('app.aboutUs', {
    url: '/aboutUs',
    views: {
      'container': {
        templateUrl: 'partials/aboutUs.html',
        controller: 'AboutCtrl'
      }
    }
  });
});