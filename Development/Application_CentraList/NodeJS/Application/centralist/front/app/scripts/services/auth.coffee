'use strict';

angular.module('app').factory('auth', [
  "$http"
  "$rootScope"
  "$window"
  "$route"
  "$location"
  "$cookies"
  "storage"
  "appConf"
  ($http, $rootScope, $window, $route, $location, $cookies, storage, appConf) ->
    self = {user: null}
    url = appConf.api + '/login';

    ## Force update current state
    update = (response) ->
      if !angular.equals(self.user, response.data)
        self.user = response.data;
        storage.set('user', self.user);
        $rootScope.$emit('loginUpdate');
        if response.data.redirect then $window.location.href = response.data.redirect
        else $route.reload()

    ## Connection
    self.login = (login, pass)->
      $http.post(url, {login: login, pass: pass}).then(update)

    ## Update current state (on page load)
    self.get = ->
      $http.get(url).then(update
      , -> # on error
        self.user = storage.get('user')
        $rootScope.$emit('loginUpdate')
        $route.reload()
      )

    ## Logout user and disconnect from CAS
    self.logout = ->
      $http.delete(url).then(update)

    ## Redirect to the cas api
    self.cas = ->
      $window.location.replace(appConf.api + '/cas')

    ## Check connection or redirect to '/'
    self.forceConnected = ->
      # check authorizations : logged
      if self.user.id == null
        $cookies.nextLogin = $location.path()
        $location.path('/')

    $rootScope.$on('checkLogin', self.get)

    # on load
    self.get()
    $rootScope.auth = self

    return self
]);

## Add interceptor to check server logout
angular.module('app').factory('ServerLogout', [
  "$q"
  "$rootScope"
  "appConf"
  ($q, $rootScope, appConf) ->
    'responseError': (rejection)->
      if rejection.status == 401 && rejection.config.url != appConf.api + '/login'
        $rootScope.$emit('checkLogin', rejection);
      return $q.reject(rejection)
])
angular.module('app').config([
  "$httpProvider"
  ($httpProvider) ->
    $httpProvider.interceptors.push('ServerLogout')
]);