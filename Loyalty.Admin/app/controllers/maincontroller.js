(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('maincontroller', maincontroller);

    maincontroller.$inject = ['$rootScope', '$scope', '$http', '$location', '$callApi', 'authenticationService'];

    function maincontroller($rootScope, $scope, $http, $location, $callApi, authenticationService) {

        $scope.title = 'maincontroller';
        $scope.dateNow = new Date().getFullYear();

        $scope.showlogin = function () {
            return $rootScope.token() == "";
        }

        $scope.logout = function () {
            authenticationService.clearCredentials();
        }
    }
})();
