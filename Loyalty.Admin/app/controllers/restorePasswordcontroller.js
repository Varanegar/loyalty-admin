(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('restorePasswordcontroller', restorePasswordcontroller);

    restorePasswordcontroller.$inject = ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'callApiAnonymouslyService'];

    function restorePasswordcontroller($scope, $http, $rootScope, $location, $routeParams, callApiAnonymouslyService) {

        $scope.email = $routeParams.uid;
        $scope.resetCode = '';
        $scope.newPass = '';
        $scope.confirmNewPass = '';

        $scope.flLoading = false;

        $scope.restorePass = function () {
            if ($scope.newPass !== $scope.confirmNewPass) {
                alert('رمز و تکرارش');

                return;
            }

            callApiAnonymouslyService.call($rootScope.urls.resetPasswordByCodeUrl, 'post', {
                username: $scope.email,
                password: $scope.newPass,
                code: $scope.resetCode
            }, function () {
                $location.path('/login');
            });
        }

        $scope.cancelRestorePass = function () {
            $location.path('/login');
        }
    }
})();
