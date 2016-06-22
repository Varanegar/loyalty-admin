﻿(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('userscontroller', userscontroller);

    userscontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function userscontroller($scope, $location, $rootScope, toaster, callApi) {
        //$rootScope.showError('', 'asd');

        $scope.selectedUser = {};
        $scope.usersDS = {
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.usersUrl, 'GET', null, function success(response) {
                        e.success(response.data);
                        if (response.data)
                            $scope.selectedUser = response.data[0];
                    }, function error(response) {
                        
                        console.log(response);
                    });
                },
            }
        };

        $scope.showSelectedUser = function () {
            var usr = $scope.selectedUser;

            $rootScope.showSuccess('', usr.userName);
        }
        //event for user selection
        $scope.onDdlSelection = function (kendoEvent) {

            var usr = $scope.selectedUser;

            var ddl = kendoEvent.sender;
            var selectedData = ddl.dataItem(ddl.select());
        }

        var ds = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.usersUrl, 'GET', null, function success(response) {
                        e.success(response.data)
                    }, function error(response) {
                        
                        console.log(response);
                    });
                },
                parameterMap: function (options, operation) {
                    if (operation == "read")
                        return kendo.stringify(options);
                }
            },
            batch: true,
            pageSize: 20,
            requestEnd: $rootScope.onGridRequestEnd,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { editable: false, nullable: true },
                        userName: { editable: false },
                        email: { editable: false },
                        mobile: { editable: false },
                    }
                }
            }
        });

        $scope.userGridOptions = {
            dataSource: ds,
            navigatable: true,
            resizable: true,
            sortable: true,
            filterable: {
                extra: false,
                operators: {
                    string: {
                        startswith: "شروع با",
                        eq: "مساوی با",
                        neq: "نامساوی",
                        contains: "شامل"
                    }
                }
            },
            pageable: true,
            toolbar: kendo.template($("#toolbar-template").html()),
            height: 500,
            editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "userName", title: "نام کاربری", width: 200 },
                { field: "email", title: "ایمیل", width: 250 },
                { field: "mobile", title: "شماره تلفن", width: 150 },
                { command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.addUser = function () {

            $location.path('/userManager/edit');
        }

        $scope.showEdit = function (e) {
            e.preventDefault();

            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));

            $location.path('/userManager/edit/' + dataItem.id);//
        }

        $scope.testDate = '';
    }
})();