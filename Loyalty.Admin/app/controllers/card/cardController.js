(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('cardController', cardController);

    cardController.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApiAnonymouslyService'];


    function cardController($scope, $http, $rootScope, $location, authenticationService, callApiAnonymouslyService) {
        $scope.flLoading = false;
        (function initController() {
            //$scope.toolbarTemplate = kendo.template($("#toolbar").html());
        })();

        $scope.addCard = function () {
            $location.path('/card/edit');
        };

        $scope.cards = function () {
            $location.path('/card');
        }
    }

})();