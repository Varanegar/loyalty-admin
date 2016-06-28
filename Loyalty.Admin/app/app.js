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

    app.run(function ($rootScope, $cookieStore, $location, toaster, callApi) {
        var baseBackendUrl = 'http://217.218.53.71:4444'; //''; //'http://localhost:59822';

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
            //signupUrl: baseBackendUrl + '/api/identityAccounts/saveUser',
            usersUrl: baseBackendUrl + '/api/accounts/users',
            removeUserUrl: baseBackendUrl + '/api/accounts/user/delete',
            userUrl: baseBackendUrl + '/api/accounts/getUser',
            saveUserUrl: baseBackendUrl + '/api/identityAccounts/saveUser',
            profileUrl: baseBackendUrl + '/api/identityAccounts/profile',
            changePasswordUrl: baseBackendUrl + '/api/identityAccounts/ChangePassword',

            permissionCatalogsUrl: baseBackendUrl + '/api/accounts/permissionCatalogs',
            permissionCatalogsOfUserUrl: baseBackendUrl + '/api/accounts/getPersmissionCatalogsOfUser',
            savePermissionCatalogsUrl: baseBackendUrl + '/api/accounts/savePermissionCatalogs',

            regionByParentIdUrl: baseBackendUrl + '/api/base/region/cityregions/byparentid/',

            customersUrl: baseBackendUrl + '/api/loyalty/customer/customers/compress',
            customerByIdUrl: baseBackendUrl + '/api/loyalty/customer/customers/byid/',
            customerSaveUrl: baseBackendUrl + '/api/loyalty/customer/saveSingle',
            customerQuickSaveUrl: baseBackendUrl + '/api/loyalty/customer/saveSingle',
            customerGroupListUrl: baseBackendUrl + '/api/loyalty/customer/customergroups/compress',
            customerReagentFindUrl: baseBackendUrl + '/api/loyalty/customer/search/bycodeormobile',

            customerTierListUrl: baseBackendUrl + '/api/loyalty/tiers',
            customerCardsUrl: baseBackendUrl + '/api/loyalty/cards/bycustomerid',
            customerCardSaveUrl: baseBackendUrl + '/api/loyalty/cards/save',
            cardSetUrl: baseBackendUrl + '/api/loyalty/cardsets',
            saveCardSetUrl: baseBackendUrl + '/api/loyalty/cardsets/save',
            cardSetByIdUrl: baseBackendUrl + '/api/loyalty/cards/bycardsetid/compress',

            customerGroupsUrl: baseBackendUrl + '/api/loyalty/customer/customergroups',
            customerGroupSaveUrl: baseBackendUrl + '/api/loyalty/customer/customergroups/save',
            removeCustomerGroupUrl: baseBackendUrl + '/api/loyalty/customer/customergroups/delete',

            customersSearchUrl: baseBackendUrl + '/api/loyalty/customer/search/bycodeormobile',

            tierListUrl: baseBackendUrl + '/api/loyalty/tiers/',
            tierSaveUrl: baseBackendUrl + '/api/loyalty/tiers/save',
            tierByIdUrl: baseBackendUrl + '/api/loyalty/tiers/',
            tierDeleteUrl: baseBackendUrl + '/api/loyalty/tiers/delete',

            groupsUrl: baseBackendUrl + '/api/loyalty/usergroup/load',
            saveGroupUrl: baseBackendUrl + '/api/loyalty/usergroup/save',
            removeGroupUrl: baseBackendUrl + '/api/loyalty/usergroup/delete',

            myWebpages: baseBackendUrl + '/api/accounts/myWebpages',
            pages: {
                usermanagement: { url: '/#/userManager', title: 'مدیریت کاربران', order: 1 },
                permission: { url: '/#/userManager/permissions', title: 'مجوز دسترسی', order: 2 },
                groups: { url: '/#/groups', title: 'گروه کاربری', order: 3 },
                customertiers: { url: '/#/tiers/list', title: 'سطح مشتریان', order: 4 },
                customergroups: { url: '/#/customer/groups', title: 'گروه مشتریان', order: 5 },
                customerlist: { url: '/#/customer/list', title: 'مشتریان', order: 6 },
                customerquickadd: { url: '/#/customer/addQuick', title: 'ثبت سریع', order: 7 },
                cardgrouplist: { url: '/#/cardGroup/', title: 'گروه کارت', order: 8 },
                test: { url: '/#/test/', title: 'تست', order: 9 }
            }
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

        $rootScope.newGuid = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        $rootScope.sortHeaderMenu = function () {
            var $wrapper = $('.header-menu ul.navbar-nav .menu');

            $wrapper.find('li').sort(function (a, b) {
                return +a.dataset.order - +b.dataset.order;
            }).appendTo($wrapper);
        };
        $rootScope.refreshMenu = function () {
            callApi.call($rootScope.urls.myWebpages, "POST", {}, function (res) {
                //beecaaaz server has no record! :D
                if (res.data && res.data.length == 0) {
                    res.data = [
                        { resource: 'userManagement' },
                        { resource: 'permission' },
                        { resource: 'groups' },
                        { resource: 'customerTiers' },
                        { resource: 'customerGroups' },
                        { resource: 'customerList' },
                        { resource: 'customerQuickAdd' },
                        { resource: 'cardgrouplist' },
                        { resource: 'test' },
                    ];
                }
                var strmenu = '';
                res.data.forEach(function (itm) {
                    if (itm.action !== '' && itm.action !== 'List') {

                        var url = $rootScope.urls.pages[itm.resource.toLowerCase()].url;

                        var title = $rootScope.urls.pages[itm.resource.toLowerCase()].title;

                        var order = $rootScope.urls.pages[itm.resource.toLowerCase()].order;

                        strmenu += '<li class="pages-lnk" data-order=' + order + '><a href="' + url + '">' + title + '</a></li>';
                    }
                });
                $(".header-menu .navbar-nav.menu").html(strmenu);
                $rootScope.sortHeaderMenu()
            });
        }

        $rootScope.currentUser = '';
        $rootScope.getCurrentUserinfo = function () {
            callApi.call($rootScope.urls.profileUrl, "POST", null, function (res) {
                $rootScope.currentUser = res.data;
            });
        }
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
