'use strict';

angular.module('app').factory('Users', [
  "$http"
  "appConf"
  ($http, appConf) ->
    self = {}

    # set labels
    self.labels =
      login    : 'Login',
      firstName: 'Prénom',
      lastName : 'Nom',
      mail     : 'E-mail',
      tel      : 'Tèl'

    ## get user info
    self.get = (id) ->
      $http.get(appConf.api + '/users/' + id)

    ## get user info
    self.getLogin = (login) ->
      $http.get(appConf.api + '/users/login/' + login)

    ## put user info
    self.put = (user) ->
      $http.put(appConf.api + '/users/' + user.id, user)

    ## post user info
    self.post = (user) ->
      $http.post(appConf.api + '/users', user)

    ## Return all users information
    self.getAll = ->
      $http.get(appConf.api + '/users');

    ## Return all users information and suggested users
    self.getSuggested =  ->
      $http.get(appConf.api + '/users/extended').then((response) ->
        response.data.forEach((user) ->
          user.find = user.firstName + ' ' + user.lastName + ' [' + user.login + ']';
        )
        return response
      )

    ## get all subscribed lists
    self.getSubscribedLists = (user)->
      $http.get(appConf.api + '/users/' + user.id + '/lists')

    ## get all moderated lists
    self.getModeratedLists = (user)->
      $http.get(appConf.api + '/users/' + user.id + '/lists/moderated')

    return self
])
