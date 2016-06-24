(function () {
    'use strict';

    var app = angular.module('membersApp', [
     // Angular modules
     'ngAnimate',
     'ngRoute',
     'ngCookies',

     // Custom modules

     // 3rd Party Modules
     'kendo.directives',
     'toaster',
     'ADM-dateTimePicker',

    ]);

    app.run(function ($rootScope, $cookieStore, $location, toaster) {
        var baseBackendUrl = 'http://217.218.53.71:4444'; //

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
            loginUrl: baseBackendUrl + '/oauth/token',
            //loginUrl: baseBackendUrl + '/api/identityAccounts/login',

            sendPassCodeUrl: baseBackendUrl + '/api/identityAccounts/SendPassCode',
            resetPasswordByCodeUrl: baseBackendUrl + '/api/identityAccounts/ResetPasswordByCode',
            signupUrl: baseBackendUrl + '/api/identityAccounts/saveUser',
            usersUrl: baseBackendUrl + '/api/accounts/users',

            userUrl: baseBackendUrl + '/api/accounts/getUser',
            saveUserUrl: baseBackendUrl + '/api/identityAccounts/saveUser',

            permissionCatalogsUrl: baseBackendUrl + '/api/accounts/permissionCatalogs',
            permissionCatalogsOfUserUrl: baseBackendUrl + '/api/accounts/getPersmissionCatalogsOfUser',
            savePermissionCatalogsUrl: baseBackendUrl + '/api/accounts/savePermissionCatalogs',

            customersUrl: baseBackendUrl + '/api/customers/list'
        };

        $rootScope.onGridRequestEnd = function (e) {
            if (e.type == "update" && !e.response.Errors)
                showSuccess('', 'اطلاعات ثبت شد.');

            if (e.type == "create" && !e.response.Errors)
                showSuccess('', 'اطلاعات ثبت شد.');
        }

        $rootScope.showError = function (title, message) {
            toaster.pop('error', title, message);
            //unfreezUI();
        };
        $rootScope.showSuccess = function (title, message) {
            toaster.pop('success', title, message);
        };

        $rootScope.gridAuthHeader = function (req) {
            req.setRequestHeader('Authorization', 'Bearer ' + $rootScope.token);
            req.setRequestHeader('OwnerKey', $rootScope.privateOwnerId);
            req.setRequestHeader('DataOwnerKey', $rootScope.dataOwnerId);
            req.setRequestHeader('DataOwnerCenterKey', $rootScope.dataOwnerCenterId);
        };

        $rootScope.errorMessage = {
            unAuthorized: "شما مجوز لازم را برای این درخواست ندارید!",
        };

        $rootScope.showAjaxError = function (jqXHR) {

            var title = jqXHR.status,
                message = jqXHR.statusText

            if (jqXHR.responseJSON) {
                title = jqXHR.responseJSON.error;
                message = jqXHR.responseJSON.error_description;
            }

            if (jqXHR.status == 400) {
                title = '400';

                if (jqXHR.responseJSON)
                    message = jqXHR.responseJSON.message;
            }

            if (jqXHR.status == 401) {
                title = '401';
                message = $rootScope.errorMessage.unAuthorized;
            }
            if (jqXHR.status == 403) {
                title = '403';
                message = $rootScope.errorMessage.unAuthorized;
            }
            if (jqXHR.status == 400 && jqXHR.responseJSON && jqXHR.responseJSON.modelState != undefined) {
                title = 'خطا';
                var modelState = jqXHR.responseJSON.modelState;
                var errorsString = "";
                var errors = [];
                for (var key in modelState) {
                    if (modelState.hasOwnProperty(key)) {
                        errorsString = (errorsString == "" ? "" : errorsString + "<br/>") + modelState[key];
                        errors.push(modelState[key]);//list of error messages in an array
                    }
                }
                message = errorsString;
            }
            if (jqXHR.status == 400 && jqXHR.responseJSON && jqXHR.responseJSON.modelState == undefined) {
                title = 'خطا';
                message = jqXHR.responseJSON.message;
            }

            if (jqXHR.status == 400 && jqXHR.data && jqXHR.data.error != '') {
                title = jqXHR.data.error;
                message = jqXHR.data.error_description;
            }

            $rootScope.showError(title, message);

            console.log(title + ': ' + message);
        }

        $rootScope.$on("$routeChangeStart", function (evt, to, from) {
            if (to.authorize === true) {
                to.resolve = to.resolve || {};
                if (!to.resolve.authorizationResolver) {
                    to.resolve.authorizationResolver = function () {
                        if (!$rootScope.token() != "")
                            throw new AuthorizationError();

                        return true;
                    };
                }
            }
        });

        $rootScope.$on("$routeChangeError", function (evt, to, from, error) {
            if (error instanceof AuthorizationError) {
                $location.path("/login").search("returnTo", to.originalPath);

                $rootScope.showError('', 'لطفا ابتدا لاگین نمایید');
            }
        });

        // Custom error type
        function AuthorizationError(description) {
            this.message = "Forbidden";
            this.description = description || "User authentication required.";
        }

        AuthorizationError.prototype = Object.create(Error.prototype);
        AuthorizationError.prototype.constructor = AuthorizationError;

    });

    app.config(['$httpProvider', function ($httpProvider) {
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        //$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        $httpProvider.defaults.useXDomain = true;
    }]);

    //see other options
    //https://amirkabirdataminers.github.io/ADM-dateTimePicker/#/
    //https://github.com/AmirkabirDataMiners/ADM-dateTimePicker
    app.config(['ADMdtpProvider', function (ADMdtp) {
        ADMdtp.setOptions({
            calType: 'jalali',
            format: 'YYYY/MM/DD',
            autoClose: true,
            multiple: false, //hide gregorian
            default: 'today',
        });
    }]);
})();
