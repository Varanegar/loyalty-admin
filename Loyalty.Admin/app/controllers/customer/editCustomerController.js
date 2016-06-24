(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerController', editCustomerController);

    editCustomerController.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerController($scope, $http, $rootScope, $location, authenticationService, callApi, callApiAnonymouslyService) {
        $scope.flLoading = false;
        (function initController() {
            //$location.path('/customer/edit');
        })();

        $scope.customer = {};

        $scope.save = function () {
            // TODO: fix save customer
            //callApi.call('url', 'POST', JSON.stringify($scope.customer), function () {
            //    // success 
            //}, function () {
            //    // faild
            //});

            $scope.customers();
        };

        $scope.customers = function () {
            $location.path('/customer');
        }
    }
})();
