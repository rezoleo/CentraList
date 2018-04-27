'use strict';

angular.module('app').factory('Lists', [
  "$http"
  "$window"
  "appConf"
  ($http, $window, appConf) ->
    self = {}

    ###
    Variables
    ###

    # define lists types
    self.types = [
      {label: 'Ouverte', bsType: 'success', icon: 'eye-open', tooltip: 'Tout les utilisateurs peuvent s\'inscrire et voir le contenu', publicContent: true, memberContent: true, usersCanJoin: true, usersCanRequest: false },
      {label: 'Fermée', bsType: 'warning', icon: 'eye-close', tooltip: 'La liste est apparait dans la page d\'accueil mais les demandes sont modérées', publicContent: false, memberContent: false, usersCanJoin: false, usersCanRequest: true  },
      {label: 'Masquée', bsType: 'danger', icon: 'minus-sign', tooltip: 'Seul les modérateurs peuvent voir cette liste', publicContent: false, memberContent: false, usersCanJoin: false, usersCanRequest: false }
      {label: 'Sondage', bsType: 'info', icon: 'eye-open', tooltip: 'Tout le monde peut participer', publicContent: false, memberContent: false, usersCanJoin: true, usersCanRequest: false }
    ];
    self.userFields = ['login', 'firstName', 'lastName', 'mail', 'tel'];
    self.categories = [
      {type: 0, label: 'Autre', group: 'others'}
      {type: 1, label: 'Association', group: 'associations'}
      {type: 2, label: 'Club', group: 'clubs'}
      {type: 3, label: 'Évènement', group: 'others'}
      {type: 4, label: 'Sondage', group: 'others'}
      {type: 5, label: 'Commande groupée', group: 'others'}
    ];
    self.fieldTypes =
      text  : {label: 'Texte'}
      bool  : {label: 'Oui/Non'}
      select: {label: 'Menu', options: true}


    ###
    List info
    ###

    ## get list info
    self.get = (id) ->
      $http.get(appConf.api + '/lists/' + id).then((response) ->
        # set list properties
        response.data.$type = self.types[response.data.type]
        return response
      )

    ## save list info
    self.save = (list) ->
      if list.id
        action = $http.put(appConf.api + '/lists/' + list.id, list)
      else
        action = $http.post(appConf.api + '/lists', list)
      return action

    ## delete list
    self.delete = (list) ->
      $http.delete(appConf.api + '/lists/' + list.id)

    ## get all visible
    self.getAllVisible = ->
      $http.get(appConf.api + '/lists')

    ###
    List moderators
    ###

    ## get list moderators
    self.getModerators = (list, users) ->
      $http.get(appConf.api + '/lists/' + list.id + '/mods').then((response) ->
        # collect ids
        ids = response.data.map((link)-> link.userId)
        # filter available users
        response.data = users.filter((user) -> ids.indexOf(user.id) != -1)
        return response
      )

    ## Update list's moderators
    self.putModerators = (list, moderators) ->
      ids = moderators.map((user) ->{id: user.id})
      $http.put(appConf.api + '/lists/' + list.id + '/mods', ids)

    ###
    List links
    ###
    self.links = {}
    # post links
    self.links.post = (list, link)->
      $http.post(appConf.api + '/lists/' + list.id + '/links', link)
    # put links
    self.links.put = (list, link)->
      $http.put(appConf.api + '/lists/' + list.id + '/links/' + link._id, link)
    # put links
    self.links.delete = (list, link)->
      $http.delete(appConf.api + '/lists/' + list.id + '/links/' + link._id)

    ## send a link
    self.links.send = (list, link)->
      toSend = angular.copy(link)
      toSend.listId = list.id
      # check user changes
      if toSend.userId
        self.userFields.forEach((field) ->
          if toSend.data['user_' + field] == toSend.$user[field]
            delete toSend.data['user_' + field]
        )
      # clean fields if field not any more if list fields
      listFields = list.fields.map((field)-> field.name)
      for field of toSend.data
        if !/^user_/.test(field) && (listFields.indexOf(field) == -1) then delete toSend.data[field]
      # select request
      if toSend.toDelete
        request = self.links.delete(list, toSend)
      else if toSend._id
        request = self.links.put(list, toSend)
      else
        request = self.links.post(list, toSend)
      return request

    ###
    Stats
    ###
    self.getStats = (list) ->
      $http.get(appConf.api + '/lists/' + list.id + '/stats')

    ###
    List operations
    ###

    ## get links of the list
    self.getLinks = (list) ->
      $http.get(appConf.api + '/lists/' + list.id + '/links')

    ## send queue links to the list
    self.sendLinks = (list, queue, success, error) ->
      queue.forEach((link) ->
        self.links.send(list, link).then((response) ->
          index = queue.indexOf(link)
          queue.splice(index, 1)
          response.$link = link
          success(response)
        , (response) ->
          response.$link = link;
          error(response);
        );
      )

    ## export list
    self.export = (list)->
      $window.location.href = appConf.api + '/lists/' + list.id + '/export/csv'

    return self
])