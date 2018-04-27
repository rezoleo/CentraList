'use strict';

angular.module('app').controller('HomeCtrl', [
  "$rootScope"
  "$scope"
  "auth"
  "Users"
  "Lists"
  ($rootScope, $scope, auth, Users, Lists)->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # on app load, waiting login state
    if (!auth.user) then return
    auth.forceConnected();
    # get user subscribed lists
    Users.getSubscribedLists(auth.user).then((response)->$scope.subscribedLists = response.data)
    # get user subscribed lists
    Lists.getAllVisible().then((response)->
      $scope.visibleLists = {associations: [], clubs: [], others: []};
      response.data.forEach((list)->
        # check list category
        if !list.category || list.category.type == null
          list.category = {type: 0}
        # set list $category
        list.$category = Lists.categories[list.category.type];
        # add the list in its group
        $scope.visibleLists[list.$category.group].push(list)
      )
    )

    ###
    initialization
    ###

    $scope.Lists = Lists
    $scope.user = auth.user
    $scope.moderatedLists = []
])
