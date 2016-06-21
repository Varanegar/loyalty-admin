(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('usereditcontroller', usereditcontroller);

    usereditcontroller.$inject = ['$scope', '$location', '$rootScope', '$routeParams', 'toaster', 'callApi'];

    function usereditcontroller($scope, $location, $rootScope, $routeParams, toaster, callApi) {
        $scope.userId = $routeParams.uid;
    }
})();