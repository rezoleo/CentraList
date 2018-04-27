'use strict'

angular.module('app').controller('ListJoinCtrl', [
  "$rootScope"
  "$scope"
  "$timeout"
  "$routeParams"
  "auth"
  "Lists"
  ($rootScope, $scope, $timeout, $routeParams, auth, Lists)->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # on app load, waiting login state
    if !auth.user then return
    auth.forceConnected()

    ## set list info then load data
    setList = (list) ->
      if (list)
        # set list
        $scope.list = list;
        # reset form
        $timeout($scope.reset)

    ###
    Form
    ###

    ## Reset the form
    $scope.reset = ->
      $scope.newLink = {data: {}}
      $scope.findUser = ''
      for field in $scope.list.fields
        if field.type == 'bool' then $scope.newLink.data[field.name] = 'Oui'
        if field.type == 'select' then $scope.newLink.data[field.name] = field.options[0]
      $scope.checkForm()
      # set current user
      $scope.findUser = auth.user
      $scope.setUser()
      $timeout(->$('#findUser').focus())

    ## Check input validity
    $scope.check = (name)->
      field = $scope.form[name]
      return (field.$invalid)

    ## Check input validity for those who can't have a name attribute
    $scope.check2 = (selector) ->
      field = $(selector)
      return (field.hasClass('ng-invalid'))

    ## Check global form validity
    $scope.checkForm = ->
      return $scope.form.$invalid

    $scope.setUser = ->
      user = $scope.findUser
      # set link user
      $scope.newLink.$user = user
      $scope.newLink.userId = user.id || null
      # set user data
      for field in Lists.userFields
        $scope.newLink.data['user_' + field] = user[field]
      # reset research input
      $scope.findUser = ''

    $scope.submit = ->
      Lists.links.send($scope.list, $scope.newLink).then(->
        $scope.list.isLinked = true
      , (response)-> # on error
        $scope.alerts.push({type: 'danger', msg: JSON.stringify(response.data.message || response.data || response)})
      )

    ###
    initialization
    ###
    $scope.queue = []

    $scope.list = null
    #load list info
    Lists.get($routeParams.listId).then((response) -> setList(response.data))
])
