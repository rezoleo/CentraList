'use strict';

angular.module('app').controller('ListEmailsCtrl', [
  '$rootScope'
  '$scope'
  '$modalInstance'
  'links'
  ($rootScope, $scope, $modalInstance, links) ->
    ## Arduino stopping
    $rootScope.arduino.stopListener()

    # set default values
    $scope.withNames = true
    # display emails
    $scope.update = ->
      $scope.withNames = !$scope.withNames
      emails = []
      # for each link
      links.forEach((link)->
        # check if there is an email
        if link.data.user_mail
          # add email to the list
          emails.push(if $scope.withNames then link.data.user_firstName + ' ' + link.data.user_lastName + '<' + link.data.user_mail + '>' else link.data.user_mail)
      )
      $scope.emails = emails.join('; ')
    $scope.update()
    $scope.instance = $modalInstance
])
