(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('profilecontroller', profilecontroller);

    profilecontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function profilecontroller($scope, $location, $rootScope, toaster, callApi) {

        function getCurrentUser() {
            callApi.call($rootScope.urls.profileUrl, "POST", null, function (res) {
                $rootScope.currentUser = res.data;
                $scope.user = res.data;
            });
        }
        if ($rootScope.currentUser !== '')
            $scope.user = $rootScope.currentUser;
        else
            getCurrentUser();

        $scope.flLoading = false;
        $scope.oldPassword = '';
        $scope.password = '';
        $scope.confirmPassword = '';

        $scope.changePass = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $rootScope.showError('', 'رمز و تکرار آن برابر نیست');
                return;
            }
            $scope.flLoading = true;

            callApi.call($rootScope.urls.changePasswordUrl, 'post', {
                oldPassword: $scope.oldPassword,
                newPassword: $scope.password,
                confirmPassword: $scope.confirmPassword,
            }, function (res) {
                $rootScope.showSuccess('اطلاعات ذخیره گردید');
                $scope.flLoading = false;
            });
        }
    }
})();