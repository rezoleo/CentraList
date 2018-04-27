'use strict'

angular.module('app').controller('ListEditCtrl', [
  "$rootScope"
  "$scope"
  "$filter"
  "$routeParams"
  "$location"
  "$modal"
  "$timeout"
  "auth"
  "Lists"
  "Users"
  "effects"
  ($rootScope, $scope, $filter, $routeParams, $location, $modal, $timeout, auth, Lists, Users, effects) ->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # on app load, waiting login state
    if !auth.user then return
    auth.forceConnected()

    ###
    Form
    ###

    ## Check input validity
    $scope.check = (name) ->
      field = $scope.form[name]
      return (field.$invalid)

    ## Check global form validity
    $scope.checkForm = ->
      $scope.form.new_mod.$setValidity('require', $scope.moderators && $scope.moderators.length)
      return $scope.form.$invalid

    ## Remove a object from an array
    $scope.remove = (object, array) ->
      index = array.indexOf(object)
      if (index != -1)
        array.splice(index, 1)
        $scope.checkForm()

    ## Check and submit form on form submit
    $scope.submit = ->
      # check form validity
      if $scope.checkForm() then return
      # complete userFields options with missing 'false'
      Lists.userFields.forEach((field)->
        if !$scope.list.userFields[field] then $scope.list.userFields[field] = false
      )
      # complete new fields name
      $scope.list.fields.forEach((field)->
        if !field.name
          name = cleanName(field.label)
          # check if unique
          bad = true
          while bad
            bad = false
            for _field in $scope.list.fields
              if name == _field.name
                bad = true
                name += '_'
          field.name = name
      )
      # check if it is a new list and request server
      Lists.save($scope.list).then((response) ->
        # set list id
        $scope.list.id = response.data.id
        Lists.putModerators($scope.list, $scope.moderators).then(->
          # trigger header update
          $rootScope.$emit('listsUpdate')
          # move to list page
          $location.path('/lists/' + $scope.list.id)
        , onError)
      , onError)

    ## Reset the form
    $scope.reset = ->
      $scope.list = angular.copy(_list)
      $scope.moderators = angular.copy(_moderators)
      $scope.new = {mod: '', field: '', category: {type: 0}}
      $scope.checkForm()

    ###
    Operations
    ###

    ## Add the selected moderator
    $scope.addMod = ->
      if $scope.users.indexOf($scope.new.mod) != -1 && $scope.moderators.indexOf($scope.new.mod) == -1
        $scope.moderators.push($scope.new.mod)
        $scope.checkForm()
      $scope.new.mod = ''

    ## Clean field name
    cleanName = (s) ->
      rules =
        'a' : /[àáâãäå]+/g
        'ae': /[æ]+/g
        'c' : /[ç]+/g
        'e' : /[èéêë]+/g
        'i' : /[ìíîï]+/g
        'n' : /[ñ]+/g
        'o' : /[òóôõö]+/g
        'oe': /[œ]+/g
        'u' : /[ùúûü]+/g
        'y' : /[ýÿ]+/g
        '_' : /[\W\\]+/g

      s = s.toLowerCase()
      for r in rules
        s = s.replace(rules[r], r)
      s = s.replace(/(?:^|_)\S/g, (a)->a.toUpperCase())
      s = s.replace(/_/g, '')
      return s

    ## Add a field
    $scope.addField = ->
      $scope.list.fields.push({
        type: 'text'
      })
    ###      #Todo
      # set field
      label = $scope.new.field.replace(/(^[ ]+)|([ ]+$)/g, '')
      field = {
        name : cleanName(label)
        label: label
      }
      # check unique field
      bad = true
      while bad
        bad = false
        for _field in $scope.list.fields
          if field.name == _field.name
            bad = true
            field.name += '_'
      # add field to the list
      $scope.list.fields.push(field)
      # reset input
      $scope.new.field = ''
      $scope.checkForm()###

    ## Delete a list after displaying a confirmation box
    $scope.delete = ->
      $modal.open(
        templateUrl: '/views/listEditDelete.html',
        controller : ['$scope', '$modalInstance', 'list', ($scope, $modalInstance, list) ->
          $scope.list = list
          $scope.instance = $modalInstance
        ],
        resolve    :
          list: -> $scope.list
      ).result.then(->
        Lists.delete($scope.list).then(->
          $rootScope.$emit('listsUpdate')
          $location.path('/home')
        , onError)
      )

    ## on error
    onError = (response)->
      effects.shake('.listing-white-block')
      $scope.alerts = [
        {type: 'danger', msg: JSON.stringify(response.data.message || response.data || response)}
      ]

    ###
    initialization
    ###
    $scope.Lists = Lists
    _list =
      name      : ''
      desc      : ''
      fields    : []
      userFields: {firstName: true, lastName: true, mail: true}
      type      : 2
      creatorId : auth.user.id
    _moderators = [auth.user]
    $scope.list = null
    $scope.moderators = null
    $scope.users = []
    $scope.alerts = []

    # download all users
    Users.getAll().then((response) ->
      # set available users
      $scope.users = response.data
      # check if creation
      if !$routeParams.listId
        $scope.reset()
      else
        # load list
        Lists.get($routeParams.listId).then((response)->
          # set list
          _list = response.data
          # load moderators
          Lists.getModerators(_list, $scope.users).then((response) ->
            _moderators = response.data
            $scope.reset()
          )
        )
    )
])
