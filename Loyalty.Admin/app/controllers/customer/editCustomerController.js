(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerController', editCustomerController);

    editCustomerController.$inject = ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerController($scope, $http, $rootScope, $location, $routeParams, authenticationService, callApi, callApiAnonymouslyService) {
        $scope.flLoading = false;
        (function initController() {
            $scope.flLoading = true;
            debugger;
            var url = $rootScope.urls.customerByIdUrl;

            callApi.call(url, 'POST', { customerId: $routeParams.uid }, function (response) {
                console.log(response);
            }, function () { });
        })();

        $scope.customer = {};

        $scope.save = function () {
            // TODO: fix save customer
            callApi.call($rootScope.urls.customerSaveUrl, 'POST', JSON.stringify($scope.customer), function () {
                // success 
                $scope.customers();
            }, function () {
                // faild
            });

        };

        $scope.customers = function () {
            $location.path('/customer');
        }
    }
})();
