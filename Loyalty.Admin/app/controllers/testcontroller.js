(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('testcontroller', testcontroller);

    testcontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function testcontroller($scope, $location, $rootScope, toaster, callApi) {
        $scope.testDate = '';

        $scope.searchTerm = '';
        $scope.selectedCustomer = '';

        $scope.customersDataSource = {
            serverFiltering: true,
            transport: {
                read:
                    function (e) {
                        callApi.call($rootScope.urls.customersSearchUrl, 'Post', {
                            searchTerm: $scope.searchTerm
                        }, function (response) {
                            e.success(response.data)
                        });
                    }
            }
        };

        $scope.customerOptions = {
            dataSource: $scope.customersDataSource,
            dataTextField: "customerName",
            minLength: 2,
            delay: 500,
            filter: "contains",
            placeholder: "کد یا موبایل مشتری",
            select: function (e) {
                var dataItem = this.dataItem(e.item.index());

                $scope.selectedCustomer = dataItem;
            },
            template: 'نام: #: customerName#, کدمشتری: #: customerCode#, موبایل: #: mobile#',
            //headerTemplate: '<div class="dropdown-header">' +
            //'<span class="k-widget k-header">Photo</span>' +
            //'<span class="k-widget k-header">Contact info</span>' +
            //'</div>',
            //// using  templates:
            //template: '<span class="k-state-default"><img src=\"\" alt=\"\" /></span>' +
            //'<span class="k-state-default"><h3></h3><p></p></span>',
        };

        $scope.userComboOptions = {
            placeholder: "کاربر مورد نظر راانتخاب نمایید",
            dataTextField: "userName",
            dataValueField: "id",
            filter: "contains",
            minLength: 2,
            autoBind: false,
            dataSource: {
                //serverFiltering: true,
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
            },
            headerTemplate: '<div class="row k-widget k-header">' +
                                '<div class="col-xs-3">نام کاربری</div>' +
                                '<div class="col-xs-3">نام</div>' +
                                '<div class="col-xs-3">ایمیل</div>' +
                            '</div>',

            template: '<div class="row" >' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.userName #</h4></div>' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.fullName #</h4></div>' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.email #</h4></div>' +
                       '</div>',

        };
        $scope.selectedUserId = '';
        //event for user selection
        $scope.onSelectUser = function (kendoEvent) {

        }

        $scope.selectedIds = [];
        $scope.userMultiSelectOptions = {
            placeholder: "کاربران مورد نظر راانتخاب نمایید",
            dataTextField: "userName",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                //serverFiltering: true,
                transport: {
                    read: function (e) {
                        callApi.call($rootScope.urls.usersUrl, 'GET', null, function success(response) {
                            e.success(response.data);
                        });
                    },
                }
            },
            headerTemplate: '<div class="row k-widget k-header">' +
                                '<div class="col-xs-3">نام کاربری</div>' +
                                '<div class="col-xs-3">نام</div>' +
                                '<div class="col-xs-3">ایمیل</div>' +
                            '</div>',

            template: '<div class="row" >' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.userName #</h4></div>' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.fullName #</h4></div>' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.email #</h4></div>' +
                       '</div>',
            select: function (e) {

                var dataItem = this.dataItem(e.item.index());

                //$scope.selectedCustomer = dataItem;
            },
        };

        $scope.show = function () {
            console.log($scope.selectedIds);
        }
    }
})();