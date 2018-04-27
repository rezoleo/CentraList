'use strict';

angular.module('app').controller('UserCreateCtrl', [
  "$rootScope"
  "$scope"
  "$location"
  "auth"
  "Users"
  "effects"
  ($rootScope, $scope, $location, auth, Users, effects) ->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # on app load, waiting login state
    if !auth.user then return
    # check authorizations : not logged and connected via CAS
    if !auth.user.cas_user then return auth.cas()

    # initialization
    if !auth.user.suggest then auth.user.suggest = {}
    _user =
    # set login as CAS login
      login    : auth.user.cas_user,
      firstName: auth.user.suggest.firstName,
      lastName : auth.user.suggest.lastName,
      mail     : auth.user.suggest.mail
    $scope.user = {};
    $scope.alerts = [];
    $scope.newUser = null;

    ## Check and submit form on form submit
    $scope.submit = ->
      # check form validity
      if $scope.form.$invalid then return
      Users.post($scope.user).then(-> # success
        $scope.newUser = $scope.user;
      , (response) ->
        # error
        effects.shake('.listing-white-block')
        if (response.status == 400)
          $scope.alerts = [
            {type: 'danger', msg: response.data.message}
          ]
        else
          $scope.alerts = [
            {type: 'danger', msg: 'Une erreur est survenue' + JSON.stringify(response.data)}
          ];
      );


    ## Check input validity
    $scope.check = (name) ->
      field = $scope.form[name];
      return (field.$invalid);

    ## Reset the form
    $scope.reset = ->
      angular.copy(_user, $scope.user);
      $scope.checkPass = '';

    ###
    initilization
    ###
    $scope.cas = auth.cas

    $scope.reset();
    $scope.$on('$viewContentLoaded', ->
      $scope.form.user_pass2.$parsers.push((value) ->
        $scope.form.user_pass2.$setValidity('pwCheck', value == $scope.user.pass);
      )
    )
])
