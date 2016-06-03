var url = 'http://localhost:8000/';
angular.module('eazyBoredrill', ['ui.router', 'APIModule', 'ngFileUpload', 'tc.chartjs', 'ui.bootstrap', 'ngDialog', , 'colorpicker.module', 'wysiwyg.module','admin.controllers', 'login.controllers','home.controllers', 'ProjectList.controllers', 'Post.controllers', 'Mail.controllers', 'ViewMail.controllers', 'SendMail.controllers', 'DeleteMail.controllers', 'Compose.controllers', 'Faq.controllers', 'Services.controllers'])


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
.directive('dynamic', function ($compile) {
    return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
      ele.html(html);
      $compile(ele.contents())(scope);
      });
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

  .state('mailMenu', {
    url: '/mailMenu',
    abstract: true,
    templateUrl: 'partials/mailMenu.html',
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
.state('admin.post', {
    url: '/post',
    views: {
      'container': {
        templateUrl: 'partials/post.html',
        controller: 'PostCtrl'
      }
    }
  })
 .state('mailMenu.mail', {
    url: '/mail',
    views: {
      'Mailcontainer': {
        templateUrl: 'partials/mail.html',
        controller: 'MailCtrl'
      }
    }
  })
  .state('mailMenu.viewMail', {
    url: '/viewMail',
    views: {
      'Mailcontainer': {
        templateUrl: 'partials/viewMail.html',
        controller: 'ViewMailCtrl'
      }
    }
  })
  .state('mailMenu.sendMail', {
    url: '/sendMail',
    views: {
      'Mailcontainer': {
        templateUrl: 'partials/sendMail.html',
        controller: 'SendMailCtrl'
      }
    }
  })

  .state('mailMenu.deleteMail', {
    url: '/deleteMail',
    views: {
      'Mailcontainer': {
        templateUrl: 'partials/deleteMail.html',
        controller: 'DeleteMailCtrl'
      }
    }
  })

  .state('mailMenu.compose', {
    url: '/compose',
    views: {
      'Mailcontainer': {
        templateUrl: 'partials/compose.html',
        controller: 'ComposeCtrl'
      }
    }
  })

  .state('admin.Faq', {
    url: '/Faq',
    views: {
      'container': {
        templateUrl: 'partials/Faq.html',
        controller: 'FaqCtrl'
      }
    }
  })
  .state('admin.services', {
    url: '/services',
    views: {
      'container': {
        templateUrl: 'partials/services.html',
        controller: 'ServicesCtrl'
      }
    }
  })

  .state('login', {
    url: '/login',
    templateUrl: 'partials/login.html',
    controller: 'LoginCtrl'
  });
});