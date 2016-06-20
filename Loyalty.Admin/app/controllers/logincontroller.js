(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('logincontroller', logincontroller);

    logincontroller.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApiAnonymouslyService'];

    function logincontroller($scope, $http, $rootScope, $location, authenticationService, callApiAnonymouslyService) {

        $scope.email = '';
        $scope.password = '';

        $scope.flLoading = false;

        (function initController() {
            // reset login status
            authenticationService.clearCredentials();
        })();

        $scope.requestRestorePassCode = function () {
            if ($scope.email !== '') {
                callApiAnonymouslyService.call($rootScope.urls.sendPassCodeUrl, 'post', {
                    username: $scope.email
                }, function () {
                    $location.path('/restorePassword/' + $scope.email);
                });
            }
            else
                alert('نام کاربری');//todo: $rootScope.showErrMsg('نام کاربری');
        }

        $scope.login = function () {

            $scope.flLoading = true;

            authenticationService.login($scope.email, $scope.password, function (response) {
                authenticationService.setCredentials($scope.email, $scope.password, response.data.access_token);

                $scope.flLoading = false;

                $location.path('/');
            });
        }
    }
})();
