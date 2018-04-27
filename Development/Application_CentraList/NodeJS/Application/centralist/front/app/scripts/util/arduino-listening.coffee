'use strict';

angular.module('app').run(['$rootScope', '$interval', 'appConf', 'Arduino', ($rootScope, $interval, appConf, Arduino) ->
  $rootScope.arduino = {}
  $rootScope.arduino.pid = undefined
  $rootScope.arduino.lastSignal = null
  $rootScope.arduino.status = null

  $rootScope.arduino.startListener = ->
    if angular.isDefined($rootScope.arduino.pid)
      return
    $rootScope.arduino.pid = $interval((->
      if $rootScope.arduino.status == null
        $rootScope.arduino.status = "starting"
        Arduino.readSignal()
        .then ({data})->
          $rootScope.arduino.lastSignal = data
          $rootScope.arduino.status = "started"
        .catch (res)->
          $rootScope.arduino.status = "stopped"
      else if $rootScope.arduino.status == "started"
        $rootScope.arduino.status = "reading"
        Arduino.readSignal()
        .then ({data})->
          if data.seq != $rootScope.arduino.lastSignal.seq && data.signal.event == "reading"
             $rootScope.arduino.lastSignal = data
          $rootScope.arduino.status = "started"
        .catch (res)->
          $rootScope.arduino.status = "stopped"
      else if $rootScope.arduino.status == "stopped"
          $rootScope.arduino.stopListener();
    ), appConf.arduinoTime)
    return

  $rootScope.arduino.stopListener = ->
    if angular.isDefined($rootScope.arduino.pid)
      $interval.cancel($rootScope.arduino.pid);
      $rootScope.arduino.pid = undefined;
    return
    
  $rootScope.arduino.restartListener = ->
    $rootScope.arduino.stopListener()
    $rootScope.arduino.startListener()
    return

  return
])
