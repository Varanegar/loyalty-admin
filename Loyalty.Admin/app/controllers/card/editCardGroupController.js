(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('editCardGroupController', editCardGroupController);

    editCardGroupController.$inject = ['$scope', '$http', '$rootScope', '$routeParams', '$location', 'callApi', 'authenticationService', 'callApiAnonymouslyService'];
    function editCardGroupController($scope, $http, $rootScope, $routeParams, $location, callApi, authenticationService, callApiAnonymouslyService) {

        $scope.cardSet = {
            loyaltyCardSetGenerateTypeId: "aebc1016-a309-440d-a9ae-dada3d33d8d8"
        };

        $scope.save = function () {
            callApi.call($rootScope.urls.saveCardSetUrl, 'POST', { loyaltyCardSetListData: [$scope.cardSet] },
                function (response) {

                    $scope.cardGroups();
                },
                function (error) {
                    $rootScope.showError('خطا', 'خطایی در ذخیره گروه کارت رخ داد.');
                });
        };

        $scope.cardGroups = function () {
            $location.path('/cardGroup/');
        };

        (function initController() {
            if ($routeParams.uid) {
                // edit mode
                callApi.call($rootScope.urls.cardSetByIdUrl, 'POST', { loyaltyCardSetId: $routeParams.uid }, function (response) {
                    console.log(response);
                    $scope.cardSet = response.data;
                }, function (error) { });
            } else {
                // new mode
            }

        })();

    }

})();