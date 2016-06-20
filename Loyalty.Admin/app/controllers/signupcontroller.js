(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('signupcontroller', signupcontroller);

    signupcontroller.$inject = ['$scope', '$http', '$rootScope', '$location', 'callApiAnonymouslyService'];

    function signupcontroller($scope, $http, $rootScope, $location, callApiAnonymouslyService) {
        $scope.fullname = '';
        $scope.username = '';
        $scope.mobile = '';
        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';

        $scope.flLoading = false;

        $scope.signup = function () {
            if ($scope.password !== $scope.confirmPassword)
            {
                alert('رمز و تکرارش');
                return;
            }

            callApiAnonymouslyService.call($rootScope.urls.signupUrl, 'post', {
                fullname: $scope.fullname,
                username: $scope.username,
                mobile: $scope.mobile,
                email: $scope.email,
                password: $scope.password,
                confirmPassword: $scope.confirmPassword
            }, function () {
                //todo: $rootScope.showSuccessMsg();

                $location.path('/login');
            });
        }

        $scope.cancelSignup = function () {
            $location.path('/');
        }
    }
})();
