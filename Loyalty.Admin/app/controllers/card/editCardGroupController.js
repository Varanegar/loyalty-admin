(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('editCardGroupController', editCardGroupController);

    editCardGroupController.$inject = ['$scope', '$http', '$rootScope', '$routeParams', '$location', 'callApi', 'authenticationService', 'callApiAnonymouslyService'];
    function editCardGroupController($scope, $http, $rootScope, $routeParams, $location, callApi, authenticationService, callApiAnonymouslyService) {

        $scope.generateTypes = [
            { typeName: 'سریالی', id: 'AEBC1016-A309-440D-A9AE-DADA3D33D8D8', key: 'serial' },
            { typeName: 'دستی', id: 'E6559D55-FC64-4E2A-A82B-2CFFE940199B', key: 'manual' }
        ];

        $scope.isManualGenerateModeSelected = function () {
            for (var i = 0; i < $scope.generateTypes.length; i++) {
                if ($scope.generateTypes[i].key == 'manual' &&
                    $scope.cardSet.loyaltyCardSetGenerateTypeId == $scope.generateTypes[i].id)
                    return true;
            }

            return false;
        }

        $scope.cardSet = {

        };

        $scope.cardSetGenerateTypeDataSource = {
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.usersUrl, 'GET', null, function success(response) {
                        e.success(response.data);
                        if (response.data)
                            $scope.selectedUser = response.data[0].id;
                    }, function error(response) {
                        console.log(response);
                    });
                },
            }
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
                for (var i = 0; i < $scope.generateTypes.length; i++) {
                    if ($scope.generateTypes[i].key == 'serial') {
                        $scope.cardSet.loyaltyCardSetGenerateTypeId = $scope.generateTypes[i].id;
                        break;
                    }
                }
            }

        })();

    }

})();