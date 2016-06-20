//Sample: <span ng-redirect-to="#/dashboard"> Dashboard </span>

(function () {
    'use strict';

    function ngRedirectTo($window) {
        return {
            restrict: 'A',

            link: function (scope, element, attributes) {
                element.bind('click', function (event) {

                    //assign ng-Redirect-To attribute value to location

                    $window.location.href = attributes.ngRedirectTo;
                });
            }
        };
    }

    angular.module('membersApp').directive('ngRedirectTo', ngRedirectTo);

    //inject $window service for redirection

    redirectTo.$inject = ['$window'];
}());