// EazyBiz App
angular.module('adminApp', ['ui.router','ui.bootstrap','Main.Controllers', 'Login.Controllers', 'Home.Controllers', 'Contact.Controllers', 'About.Controllers', 'Services.Controllers', 'Project.Controllers'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'pages/main.html',
    controller: 'AppCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'pages/login.html',
    controller: 'LoginCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'container': {
        templateUrl: 'pages/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.contact', {
      cache: false,
      url: '/contact',
      views: {
        'container': {
          templateUrl: 'pages/contact.html',
          controller: 'ConatctCtrl'
        }
      }
    })
    .state('app.about', {
      cache: false,
      url: '/about',
      views: {
        'container': {
          templateUrl: 'pages/about.html',
          controller: 'AboutCtrl'
        }
      }
    })
    .state('app.services', {
      cache: false,
      url: '/services',
      views: {
        'container': {
          templateUrl: 'pages/services.html',
          controller: 'ServicesCtrl'
        }
      }
    })
    .state('app.project', {
      cache: false,
      url: '/project',
      views: {
        'container': {
          templateUrl: 'pages/project.html',
          controller: 'ProjectCtrl'
        }
      }
    })
    ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
