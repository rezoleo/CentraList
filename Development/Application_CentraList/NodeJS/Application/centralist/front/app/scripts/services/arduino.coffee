'use strict';

angular.module('app').factory('Arduino', [
  "$http"
  "appConf"
  ($http, appConf) ->
    self = {}

    ## get information about the last signal sent by the Arduino card
    self.readSignal = (params) ->
      $http.get(appConf.api + '/arduino' + '/signal/', {params: params})

    ## get information about the system
    self.readSystem = (params) ->
      $http.get(appConf.api + '/arduino' + '/system/', {params: params})

    return self
])
