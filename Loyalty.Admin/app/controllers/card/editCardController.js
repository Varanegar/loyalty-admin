(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('editCardController', editCardController);

    editCardController.$inject = ['$scope', '$http', '$rootScope', '$routeParams', '$location', 'callApi', 'authenticationService', 'callApiAnonymouslyService'];


    function editCardController($scope, $http, $rootScope, $routeParams, $location, callApi, authenticationService, callApiAnonymouslyService) {
        $scope.flLoading = false;
        $scope.customerName = '';

        $scope.card = {
            customerId: $routeParams.uid,
            cardNo: null,
            loyaltyCardSetId: null
        };

        $scope.cardSets = [];

        $scope.getCardGroups = function () {
            callApi.call($rootScope.urls.cardSetUrl, 'POST', null,
                function (response) {
                    $scope.cardSets = response.data;
                    if (response.data.length > 0) {
                        $scope.card.loyaltyCardSetId = response.data[0].uniqueId;
                    }
                },
                function (error) {
                    console.log('error while trying to fetch region data. parentId: ' + parentId);
                    console.log('error detail: ' + error);
                });
        };

        $scope.cards = function () {
            $location.path('/card/' + $routeParams.uid);
        };


        $scope.save = function () {
            callApi.call($rootScope.urls.customerCardSaveUrl, 'POST',
                JSON.stringify({ data: { loyaltyCardListData: [$scope.card] } }),
                function (response) {
                    $scope.cards();
                },
                function (error) {
                });
        };

        (function initController() {
            $scope.getCardGroups();
            $scope.customerName = $rootScope.currentCustomer.firstName + ' ' + $rootScope.currentCustomer.lastName;
        })();
    }

})();