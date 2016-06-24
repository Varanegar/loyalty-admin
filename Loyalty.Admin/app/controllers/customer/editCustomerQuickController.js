(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerQuickController', editCustomerQuickController);

    editCustomerQuickController.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerQuickController($scope, $http, $rootScope, $location, authenticationService, callApi, callApiAnonymouslyService) {
        $scope.flLoading = false;
        (function initController() {
        })();


        $scope.customer = {

        };

        $scope.save = function () {
            // TODO: fix save customer
            callApi.call($rootScope.urls.customerQuickSaveUrl, 'POST', { data: JSON.stringify($scope.customer) }, function () {
                // success 
                $scope.customers();
            }, function (error) {
                // faild
                console.log(error);
            });
        };

        $scope.customers = function () {
            $location.path('/customer/list');
        }
    }
})();
