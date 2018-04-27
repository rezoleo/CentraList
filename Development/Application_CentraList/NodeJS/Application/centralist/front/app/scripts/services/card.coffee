'use strict';

angular.module('app').factory('Card', [
  "$http"
  "appConf"
  ($http, appConf) ->
    self = {}

    ## get information about the last signal sent by the Arduino card
    self.getOneCard = (code) ->
      $http.get(appConf.api + '/card' + '/code/' + code)

    return self
])
