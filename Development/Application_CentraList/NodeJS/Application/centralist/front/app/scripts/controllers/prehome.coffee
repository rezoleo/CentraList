'use strict';

angular.module('app').controller('PrehomeCtrl', [
  "$rootScope"
  "$scope"
  "$cookies"
  "$location"
  "auth"
  "effects"
  ($rootScope, $scope, $cookies, $location, auth, effects)->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # on app load, waiting login state
    if !auth.user then return

    ## Connection
    $scope.submit = ->
      auth.login($scope.login, $scope.pass).then(-> # if connected
        $cookies.login = $scope.login
      , (response)-> # else
        effects.shake('.listing-shake');
        $scope.alerts = [];
        if (response && response.data.code!="AUTH.1.3.3")
          $scope.alerts = [
            {type: 'danger', msg: (response.data.message || response.data || response) }
          ];
      );

    nextLogin = (replace)->
      if replace then $location.replace()
      if $cookies.nextLogin && $cookies.nextLogin != '' && $cookies.nextLogin != '/'
        $location.path($cookies.nextLogin)
        $cookies.nextLogin = ''
      else
        $location.path('/home')

    ###
    initialization
    ###
    # check authorizations : not logged
    if auth.user.id != null then nextLogin(true)


    $scope.login = $cookies.login
    $scope.pass = ''
    $scope.alerts = [];
    $scope.showHowTo = true;

    $scope.cas = auth.cas
]);
