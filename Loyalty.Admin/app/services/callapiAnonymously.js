(function () {
    'use strict';

    angular
       .module('membersApp')
       .factory('callApiAnonymouslyService', callApiAnonymouslyService);

    callApiAnonymouslyService.$inject = ['$http', '$rootScope', '$timeout'];


    function callApiAnonymouslyService($http, $rootScope, $timeout) {
        var service = {};

        service.call = call;

        return service;

        function call(url, method, data, success, fail) {
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
                },
            }).then(success, function fail(response) {
                $rootScope.showAjaxError(response);

                if (fail)
                    return fail(response);
            });
        }
    }
})();