'use strict'

angular.module('app').controller('UserMyAccountCtrl', [
  "$rootScope"
  "$location"
  "$scope"
  "auth"
  "Users"
  "effects"
  ($rootScope, $location, $scope, auth, Users, effects) ->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # on app load, waiting login state
    if !auth.user then return
    auth.forceConnected()

    ## Check and submit form
    $scope.submit = ->
      # check form validity
      if ($scope.checkForm())
        return

      # send
      Users.put($scope.user).then(->
        # success
        $location.path('/home')
        auth.get()
      , (response) ->
        # error
        effects.shake('.listing-white-block')
        if (response.status == 400)
          $scope.alerts = [
            type: 'danger'
            msg : response.data.message
          ]
        else
          $scope.alerts = [
            type: 'danger'
            msg : 'Une erreur est survenue : ' + JSON.stringify(response.data.message || response.data)
          ]
      )


    ## Check input validity
    $scope.check = (name) ->
      field = $scope.form[name]
      return (field.$invalid)

    ## Check global form validity
    $scope.checkForm = ->
      $scope.form.user_pass2.$setValidity('pwCheck', $scope.checkPass == $scope.user.pass)
      return $scope.form.$invalid

    ## Reset the form
    $scope.reset = ->
      if !_user then return
      $scope.user = angular.copy(_user)
      $scope.user.pass = ''
      $scope.checkPass = ''
      $scope.checkForm()

    ## initialization
    _user = null
    $scope.user = {}
    $scope.alerts = []

    # load user
    Users.get(auth.user.id).then((response) ->
      _user = response.data
      $scope.reset()
    )

    # on page load
    $scope.$on('$viewContentLoaded', ->$scope.reset)
])
