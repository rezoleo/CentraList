'use strict';

angular.module('app').controller('HeaderCtrl', [
  "$rootScope"
  "$scope"
  "storage"
  "auth"
  "Users"
  ($rootScope, $scope, storage, auth, Users)->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    update = ->
      # if connected
      if auth.user.id
        user = auth.user;
        Users.getModeratedLists(auth.user).then((response)->
          auth.moderatedLists = response.data
          auth.moderatedLists.forEach((list)-> if storage.get('list' + list.id) then list.isOffLine = true)
          storage.set('moderatedLists', auth.moderatedLists);
        )

    # read localStorage
    auth.moderatedLists = storage.get('moderatedLists');
    # on load
    if auth.user then update()

    $rootScope.$on('loginUpdate', update);
    $rootScope.$on('listsUpdate', update);
]);
