(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerQuickController', editCustomerQuickController);

    editCustomerQuickController.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerQuickController($scope, $http, $rootScope, $location, authenticationService, callApi, callApiAnonymouslyService) {
        $scope.flLoading = false;

        $scope.personTypeId = 'F8A0E103-CBB0-40EA-BF80-E2DBC552EE3C';
        $scope.companyTypeId = '770803A2-3F46-48D1-98D2-2D656F6297DD';

        $scope.customer = {
            "firstName": null,
            "lastName": null,
            "companyId": 'cf7c4810-9da0-433c-8639-21bdbd889c85', // dont ask me "why?" :|
            "customerTypeId": null,
            "mobile": "",
            "currentTierId": null,
            "currentTierName": null,
            "currentCardId": null,
            "currentCardSerialNo": null,
            "currentCardSetId": null,
            "currentCardSet": null,
            "customerGroupId": null,
            "currentGroupName": null,
            "currentCardNo": null,
            "id": 0,
            "uniqueId": "",
            "applicationOwnerId": "",
            "dataOwnerId": "",
            "dataOwnerCenterId": "",
            "isRemoved": false,
            "createdDate": "",
            "lastUpdate": ""
        };

        $scope.getCustomerTiers = function () {
            callApi.call($rootScope.urls.customerTierListUrl, 'POST', null,
                function (response) {
                    $scope.tiers = response.data;
                    if ($scope.customer && !$scope.customer.currentTierId && response.data.length > 0) {
                        $scope.customer.currentTierId = response.data[0].uniqueId;
                    }
                },
                function (error) {
                    console.log('error while trying to fetch tier data.');
                    console.log('error detail: ' + error);
                });
        };

        $scope.getCardGroups = function () {
            callApi.call($rootScope.urls.cardSetUrl, 'POST', null,
                function (response) {
                    $scope.cardSets = response.data;
                    if ($scope.customer && !$scope.customer.currentCardSetId && response.data.length > 0) {
                        $scope.customer.currentCardSetId = response.data[0].uniqueId;
                    }
                },
                function (error) {
                    console.log('error while trying to fetch region data. parentId: ' + parentId);
                    console.log('error detail: ' + error);
                });
        };

        $scope.save = function () {
            callApi.call($rootScope.urls.customerQuickSaveUrl, 'POST', JSON.stringify({ customerData: $scope.customer }), function () {
                // success 
                $scope.customers();
            }, function (error) {
                // faild
                console.log(error);
            });
        };

        $scope.customers = function () {
            $location.path('/customer/list');
        };

        (function initController() {
            $scope.getCardGroups();
            $scope.getCustomerTiers();
        })();
    }
})();
