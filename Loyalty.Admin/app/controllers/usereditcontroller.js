(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('usereditcontroller', usereditcontroller);

    usereditcontroller.$inject = ['$scope', '$location', '$rootScope', '$routeParams', 'toaster', 'callApi'];

    function usereditcontroller($scope, $location, $rootScope, $routeParams, toaster, callApi) {

        $scope.fullname = '';
        $scope.username = '';
        $scope.mobile = '';
        $scope.email = '';
        $scope.password = '';
        $scope.confirmPassword = '';
        $scope.dsblUserName = false;
        $scope.dsblEmail = false;
        $scope.flLoading = false;

        $scope.userId = $routeParams.uid;
        $scope.loadUserInfo = function () {
            callApi.call($rootScope.urls.userUrl, "POST", { userId: $scope.userId }, function (res) {

                $scope.fullname = res.data.fullName;
                $scope.username = res.data.userName;
                $scope.email = res.data.email;
                $scope.mobile = res.data.mobile;

                $scope.dsblUserName = true;
                $scope.dsblEmail = true;

            });
        }

        if ($scope.userId)
            $scope.loadUserInfo();

        $scope.save = function () {
            if ($scope.password !== $scope.confirmPassword) {
                $rootScope.showError('', 'رمز و تکرار آن برابر نیست');
                return;
            }

            callApi.call($rootScope.urls.saveUserUrl, 'post', {
                user: JSON.stringify({
                    uniqueId: $scope.userId,
                    userId: $scope.userId,
                    fullName: $scope.fullName,
                    userName: $scope.userName,
                    password: $scope.password,
                    confirmPassword: $scope.confirmPassword,
                    email: $scope.email,
                    mobile: $scope.mobile,
                })
            }, function (res) {
                $rootScope.showSuccess('اطلاعات ذخیره گردید');

                $location.path('/userManager');
            });
        }

        $scope.cancel = function () {
            $location.path('/userManager');
        }

    }
})();