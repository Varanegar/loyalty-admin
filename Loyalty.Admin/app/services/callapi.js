(function () {
    'use strict';

    angular
       .module('membersApp')
       .factory('callApi', callApi);

    callApi.$inject = ['$http', '$rootScope', '$location'];

    function callApi($http, $rootScope, $location) {
        var service = {};

        service.call = call;

        return service;

        function call(url, method, data, success, fail) {

            if ($rootScope.token() == undefined || $rootScope.token() === '') {
                $location.path("/login");

                $rootScope.showError('', 'لطفا ابتدا لاگین نمایید');

                return;
            }

            $http({
                method: method,
                url: url,
                data: data,
                dataType: "json",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'OwnerKey': $rootScope.privateOwnerId,
                    'DataOwnerKey': $rootScope.dataOwnerId,
                    'DataOwnerCenterKey': $rootScope.dataOwnerCenterId,
                    'Authorization': 'Bearer ' + $rootScope.token(),
                },
            }).then(success, function (response) {
                $rootScope.showError(response);

                if (fail)
                    return fail;
            });
        }
    }
})();