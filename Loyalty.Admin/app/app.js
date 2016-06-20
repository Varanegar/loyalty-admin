(function () {
    'use strict';

    var app = angular.module('membersApp', [
        // Angular modules
        'ngAnimate',
        'ngRoute',
        'ngCookies',
        'kendo.directives'
        // Custom modules

        // 3rd Party Modules

    ]);

    app.run(function ($rootScope, $cookieStore) {
        var baseBackendUrl = 'http://localhost:59822';

        $rootScope.privateOwnerId = '79A0D598-0BD2-45B1-BAAA-0A9CF9EFF240';
        $rootScope.dataOwnerId = '3EEE33CE-E2FD-4A5D-A71C-103CC5046D0C';
        $rootScope.dataOwnerCenterId = '3EEE33CE-E2FD-4A5D-A71C-103CC5046D0C';

        $rootScope.token = function () {
            if ($rootScope.globals !== undefined && $rootScope.globals.currentUser !== undefined)
                return $rootScope.globals.currentUser.token;

            var glbs = $cookieStore.get('globals');

            if (glbs !== '' && glbs !== null && glbs !== undefined)
                return glbs.currentUser.token;

            return "";

        };
        $rootScope.headers = {
            ownerKey: $rootScope.privateOwnerId,
            dataOwnerKey: $rootScope.dataOwnerId,
            dataOwnerCenterKey: $rootScope.dataOwnerCenterId
        };

        $rootScope.urls = {
            //loginUrl: baseBackendUrl + '/oauth/token',
            loginUrl: baseBackendUrl + '/api/identityAccounts/login',
            sendPassCodeUrl: baseBackendUrl + '/api/identityAccounts/SendPassCode',
            resetPasswordByCodeUrl: baseBackendUrl + '/api/identityAccounts/ResetPasswordByCode',
            signupUrl: baseBackendUrl + '/api/identityAccounts/saveUser',
        };

    });

    app.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        $httpProvider.defaults.useXDomain = true;
    }]);
})();
