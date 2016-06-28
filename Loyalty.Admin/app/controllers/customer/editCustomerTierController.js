(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerTierController', editCustomerTierController);

    editCustomerTierController.$inject = ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerTierController($scope, $http, $rootScope, $location, $routeParams, authenticationService, callApi, callApiAnonymouslyService) {

        $scope.tier = {
            uniqueId: $routeParams.uid,
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

        (function initController() {
            if ($routeParams.uid) {
                // edit mode
                $scope.tier.uniqueId = $routeParams.uid;
                callApi.call($rootScope.urls.tierByIdUrl, 'POST', JSON.stringify({ uniqueId: $routeParams.uid }),
                function (response) {
                    if (response.data.length > 0)
                        $scope.tier = response.data[0];
                },
                function (error) {
                    console.log(error);
                    //$rootScope.showError('خطا', 'خطایی در ذخیره سطح مشتری رخ داد.');
                });

            } else {
                // new mode
                $scope.tier.uniqueId = $rootScope.newGuid();
            }
        })();
    }
})();