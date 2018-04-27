'use strict';

angular.module('app', [
  'ngRoute'
  'ngCookies'
  'ngResource'
  'ui.bootstrap'
  'ui.inflector'
  'ui.mask'
  'ui.scrollfix'
  'angularLocalStorage'
  'views'
])

angular.module('app').constant('appConf',
  api: if window.location.port == "3310" then 'https://localhost:9102/api' else '/api'
  arduinoTime: 1000
)

angular.module('app').config([
  "$httpProvider"
  "$routeProvider"
  "appConf"
  ($httpProvider, $routeProvider, appConf) ->
    # set credentials
    $httpProvider.defaults.withCredentials = true;

    # set routes
    $routeProvider
    .when '/',
        templateUrl: '/views/prehome.html'
        controller : 'PrehomeCtrl'
    .when '/home',
        templateUrl: '/views/home.html'
        controller : 'HomeCtrl'
    .when '/user/create',
        templateUrl: '/views/userCreate.html'
        controller : 'UserCreateCtrl'
    .when '/user/myaccount',
        templateUrl: '/views/userMyAccount.html'
        controller : 'UserMyAccountCtrl'
    .when '/lists/create',
        templateUrl: '/views/listEdit.html'
        controller : 'ListEditCtrl'
    .when '/lists/:listId',
        templateUrl: '/views/list.html'
        controller : 'ListCtrl'
    .when '/lists/:listId/edit',
        templateUrl: '/views/listEdit.html'
        controller : 'ListEditCtrl'
    .when '/lists/:listId/join',
        templateUrl: '/views/listJoin.html'
        controller: 'ListJoinCtrl'
    .otherwise
        redirectTo: '/'
])

# Check if a new cache is available on page load.
window.addEventListener('load', (e)->
  window.applicationCache.addEventListener('updateready', (e)->
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY)
      # Browser downloaded a new app cache.
      window.location.reload()
  , false)
, false)
