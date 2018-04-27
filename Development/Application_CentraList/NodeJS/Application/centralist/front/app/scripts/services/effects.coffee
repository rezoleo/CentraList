'use strict';

angular.module('app').factory('effects', [
  ->
    shake: (selector) ->
      $(selector)
      .animate({left: '+20'}, 50)
      .animate({left: '-20'}, 100)
      .animate({left: '+20'}, 100)
      .animate({left: '-20'}, 100)
      .animate({left: '+0'}, 50)
])