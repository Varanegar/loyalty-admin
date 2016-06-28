(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerTierController', editCustomerTierController);

    editCustomerTierController.$inject = ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerTierController($scope, $http, $rootScope, $location, $routeParams, authenticationService, callApi, callApiAnonymouslyService) {

        $scope.tier = {
            tierCode: '',
            tierName: '',
        };

        $scope.saveTier = function () {
            callApi.call($rootScope.urls.tierSaveUrl, 'POST', JSON.stringify({ loyaltyTierListData: [$scope.tier] }),
                function (response) {

                    $scope.tiers();
                },
                function (error) {
                    console.log(error);
                    //$rootScope.showError('خطا', 'خطایی در ذخیره سطح مشتری رخ داد.');
                }
            );
        };

        $scope.tiers = function () {
            $location.path('/tiers/list')
        };
    }
})();