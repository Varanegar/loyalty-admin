(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('editCardController', editCardController);

    editCardController.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApiAnonymouslyService'];


    function editCardController($scope, $http, $rootScope, $location, authenticationService, callApiAnonymouslyService) {
        $scope.flLoading = false;
        (function initController() {
            //$scope.toolbarTemplate = kendo.template($("#toolbar").html());
        })();

        $scope.cards = function () {
            $location.path('/cards');
        }
    }

})();