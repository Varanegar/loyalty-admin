(function () {
    'use strict';

    angular
        .module('membersApp')
        .factory('customerService', customerService);

    customerService.$inject = ['$http', '$cookieStore', '$rootScope', '$timeout'];

    function customerService($http, $cookieStore, $rootScope, $timeout) {
        var db = [];
        var self = this;


    };

})();