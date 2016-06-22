(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('customercontroller', customercontroller);

    customercontroller.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApiAnonymouslyService'];


    function customercontroller($scope, $http, $rootScope, $location, authenticationService, callApiAnonymouslyService) {

        $scope.flLoading = false;
        (function initController() {
            //$scope.toolbarTemplate = kendo.template($("#toolbar").html());
        })();

        $scope.addCustomer = function () {
            $location.path('/editCustomer');
        };

        $scope.customers = function () {
            $location.path('/customers');
        }

        $scope.cardInfo = function () {
            $location.path('/cards');
        }
    }

})();