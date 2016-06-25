(function () {
    'use strict';

    angular
          .module('membersApp', [])
          .directive('menu', function () {
              return {
                  restrict: 'E',
                  replace: true,
                  scope: {
                      loc: '@location',
                      menus: '='
                  },
                  link: function ($scope, $element) {
                  },
                  template: '<ul class="nav {{loc}}">' +
                               '<li ng-repeat="m in menus1.left">' +
                                   '<a href="{{m.link}}">{{m.text}}</a>' +
                               '</li>' +
                            '</ul>'
              };
          })
})();