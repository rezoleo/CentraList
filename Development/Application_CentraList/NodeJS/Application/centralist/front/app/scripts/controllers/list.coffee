'use strict'

angular.module('app').controller('ListCtrl', [
  "$rootScope"
  "$scope"
  "$routeParams"
  "$timeout"
  "$interval"
  "$modal"
  "$location"
  "storage"
  "auth"
  "Card"
  "Lists"
  "Users"
  ($rootScope, $scope, $routeParams, $timeout, $interval, $modal, $location, storage, auth, Card, Lists, Users) ->
    # on app load, waiting login state
    if !auth.user then return
    auth.forceConnected()

    ## Arduino starting
    $rootScope.arduino.startListener()

    ###
    Form
    ###

    ## Reset the form
    $scope.reset = ->
      $scope.newLink = {data: {}}
      $scope.findUser = ''
      $scope.list.fields.forEach((field)->
        if field.type == 'bool' then $scope.newLink.data[field.name] = 'Oui'
        if field.type == 'select' then $scope.newLink.data[field.name] = field.options[0]
      )
      $scope.checkForm()
      setCurrentUser()
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

    ## Edit link
    $scope.edit = (link) ->
      $scope.newLink = angular.copy(link)
      $scope.findUser = ''
      $scope.checkForm()

    $scope.setUser = ->
      user = $scope.findUser
      # set link user
      $scope.newLink.$user = user
      $scope.newLink.userId = user.id || null
      # set user data
      Lists.userFields.forEach((field) -> $scope.newLink.data['user_' + field] = user[field])
      # reset research input
      $scope.findUser = ''
      # focus on next input
      $timeout(->
        if ($('input[id^="data"]').length)
          $('input[id^="data"]').first().focus()
        else
          $('#user_login').focus()
      )

    $scope.submit = ->
      # add link to the queue
      $scope.queue.unshift($scope.newLink)
      # reset form
      $scope.reset()
      # update
      updateQueue()
      # updateLinks
      updateLinks()

    ## Delete link
    $scope.delete = ->
      # add to queue
      $scope.newLink.toDelete = true
      $scope.queue.push($scope.newLink)
      # update storageLocal
      updateQueue()
      # update links
      updateLinks()
      # reset form
      $scope.reset()

    ## For non moderators set current user
    setCurrentUser = ->
      # check if it is a moderator or an admin
      if !$scope.list || $scope.list.isModerator || auth.user.isAdmin then return
      # find corresponding link
      link = $scope.displayed.filter((link) -> link.userId == auth.user.id)[0]
      # if linked
      if link && !(link.action && link.action.toDelete)
        $scope.edit(link)
      else
        $scope.findUser = auth.user
        $scope.setUser()

    ###
    List
    0 - real localStorage
    1 - setList
    2 - load data
    3 - update display
    ###

    ## set list info then load data
    setList = (list) ->
      if (list)
        # set list
        $scope.list = list;
        # save into localStorage
        storeSet('list', list)
        storeSet('moderatorId', auth.user.id)
        # check offline
        if storeGet('list') && $scope.list.isModerator
          $scope.list.isOffline = true
        # load data
        if $scope.list.isModerator || auth.user.isAdmin || $scope.list.$type.publicContent
          loadData()
          updateLinks()
        else if $scope.list.$type.usersCanJoin
          $location.replace().path('/lists/'+$scope.list.id+'/join')
          return
        # reset form
        $timeout($scope.reset)

    ## load data
    loadData = () ->
      # get links
      Lists.getLinks($scope.list).then((response) ->
        $scope.links = response.data
        storeSet('links', $scope.links)
        updateDisplay()
      )
      # get suggested users
      Users.getSuggested().then((response) ->
        $scope.suggestedUsers = response.data
        storage.set('suggestedUsers', $scope.suggestedUsers)
        updateDisplay()
      )

    ## update displayed list
    updateDisplay = () ->
      if $scope.links && $scope.suggestedUsers
        # reset list
        $scope.displayed = []
        # fetch suggested ids
        ids = $scope.suggestedUsers.map((user) -> user.id)
        # look over links
        $scope.links.forEach((link) ->
          if link.userId
            index = ids.indexOf(link.userId)
            #Todo: reload suggested (! boucle)
            if index != -1
              # set link user
              link.$user = $scope.suggestedUsers[index]
              Lists.userFields.forEach((field) ->
                # set link data name
                ufield = 'user_' + field;
                # check if not already defined
                if !link.data.hasOwnProperty(ufield)
                  # set new value
                  link.data[ufield] = link.$user[field]
              )
          $scope.displayed.push(link)
        )
        # look over the queue
        $scope.queue.forEach((link) ->
          if link._id
            # find the following link
            _link = $scope.displayed.filter((_link) -> _link._id == link._id)[0]
            if _link then _link.action = link
        )
        # for non moderator
        setCurrentUser()

    ## Update Queue
    updateQueue = ->
      storeSet('queue', $scope.queue)
      updateDisplay();
      if ($scope.queue.length == 0)
        $timeout.cancel($scope.queueTimeout)
        $scope.queueVisible = false
      else if (!$scope.queueVisible)
        $scope.queueTimeout = $timeout(->
          $scope.queueVisible = true
        , 500)

    ## Remove a object from an array
    $scope.removeQueue = (link) ->
      index = $scope.queue.indexOf(link)
      if (index != -1)
        $scope.queue.splice(index, 1)
        if link._id
          # find the following link
          _link = $scope.displayed.filter((link) -> link._id == link._id)[0]
          if _link then delete _link.action
        updateQueue()


    updateLinks = () ->
      if $scope.list.isModerator
        $timeout.cancel($scope.updateTimeout);
        $scope.updateTimeout = $timeout(updateLinks, if $scope.queue.length then 15000 else 60000);
      # reset alerts
      $scope.alerts = []
      # send queue links
      Lists.sendLinks($scope.list, $scope.queue, (response)-> # on success
        # add temporary link to the list
        if(response.$link && !response.$link._id && !response.$link.toDelete)
          response.$link._id = Math.random()
          $scope.links.unshift(response.$link)
          updateDisplay()
        # update queue in localStorage
        updateQueue()
        # load links
        loadData()
      , (response)-> # on error
        # if offline
        if response.status == 0 || response.status == 404 then return
        # update link color
        if (response.$link)
          response.$link.$error = true
        # error
        $scope.alerts.push({type: 'danger', msg: JSON.stringify(response.data.message || response.data || response)})
      )

    ###
    Actions
    ###

    ## Save localStorage value
    storeSet = (name, value) ->
      if ($scope.list.isModerator)
        storage.set(name + $routeParams.listId, value)

    ## Read localStorage value
    storeGet = (name) ->
      storage.get(name + $routeParams.listId)

    ## Display the window with all emails    update()
    $scope.emails = ->
      # open window
      $modal.open(
        templateUrl: '/views/listEmails.html'
        controller : 'ListEmailsCtrl'
        resolve    :
          links: -> $scope.displayed
      )

    ## display search input
    $scope.toggleSearch = ->
      $scope.displaySearch = !$scope.displaySearch
      $scope.maxDisplayed = 50
      $scope.search = ''
      if $scope.displaySearch then $timeout(->$('.listing-search').select())

    ## display stats tab
    $scope.toggleStats = ->
      if $scope.stats
        $scope.stats = null
      else
        # get values stats
        Lists.getStats($scope.list).then((response) ->
          $scope.stats = []
          # get all list fields
          for field in $scope.list.fields
            options = []
            for value, count of response.data[field.name]
              options.push(
                value: value
                count: count
              )
            $scope.stats.push
              name: field.name
              label: field.label
              options: options
        )

    $scope.testStats = ->
      return 0

    ## export list
    $scope.export = ->
      Lists.export($scope.list)

    ###
    Initialisation
    ###

    $scope.Lists = Lists
    $scope.Users = Users
    $scope.list = null
    $scope.suggestedUsers = null
    $scope.links = null
    $scope.queue = []
    $scope.displayed = []
    $scope.queueVisible = false
    $scope.alerts = []
    $scope.updateTimeout = null
    $scope.maxDisplayed = 50
    $scope.search = ''
    $scope.stats = null

    # read localStorage
    if(storeGet('moderatorId') == auth.user.id)
      setList(storeGet('list'))
      if $scope.list
        $scope.queue = storeGet('queue') || []
        $scope.links = storeGet('links') || null
        $scope.suggestedUsers = storage.get('suggestedUsers')
        updateQueue()
        updateDisplay()
        updateLinks()

    #load list info
    Lists.get($routeParams.listId).then((response) -> setList(response.data))

    $scope.$on('$routeChangeStart', ->$timeout.cancel($scope.updateTimeout))

    # Arduino event
    $scope.$watch (-> if $rootScope.arduino.lastSignal && $rootScope.arduino.lastSignal.signal && $rootScope.arduino.lastSignal.signal.event == 'reading'
      ($rootScope.arduino.lastSignal)), (value)-> 
        if !$scope.lastSeq && value
          $scope.lastSeq = value.seq
        else if value && $scope.lastSeq!=value.seq
          Card.getOneCard(value.signal.message).then ({data})->
            if data.status!='ON'
              return
            Users.getLogin(data.owner).then ({data}) ->

              # Add in the list the owner of the card detected by the Arduino reader
              $scope.newLink.data.user_login=data.login
              $scope.newLink.data.user_firstName=data.firstName
              $scope.newLink.data.user_lastName=data.lastName
              if $scope.list.userFields.mail
                $scope.newLink.data.user_mail=data.mail
              if $scope.list.userFields.tel
                $scope.newLink.data.user_tel=data.tel
])
