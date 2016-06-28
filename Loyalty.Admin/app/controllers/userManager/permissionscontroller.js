(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('permissionscontroller', permissionscontroller);

    permissionscontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function permissionscontroller($scope, $location, $rootScope, toaster, callApi) {

        $scope.flgSave = true;

        $scope.selectedUserId = '';

        $scope.usersDS = {
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
        };

        //event for user selection
        $scope.onSelectUser = function (kendoEvent) {
            //var ddl = kendoEvent.sender;
            //var selectedData = ddl.dataItem(ddl.select());
            $scope.flgSave = false;

            $scope.resetTreeNodes();

            callApi.call($rootScope.urls.permissionCatalogsOfUserUrl, 'POST', { userId: $scope.selectedUserId }, function (response) {
                $scope.setTreeNodesCheck(response.data);
            });
        }

        //TreeView
        $scope.permissions = [];

        var trvRead = function (e) {
            var id = e.data.id || "";

            e.success($.grep($scope.permissions, function (x) {
                return x.parent == id;
            }));
        }
        $scope.permissionsOptions = {
            checkboxes: {
                checkChildren: true,
            },
            dataTextField: "title",
            loadOnDemand: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        if ($scope.permissions.length == 0)
                            callApi.call($rootScope.urls.permissionCatalogsUrl, 'POST', null, function (response) {
                                $scope.permissions = response.data;

                                trvRead(e);
                            });
                        else
                            trvRead(e);
                    }
                },
                schema: {
                    model: {
                        id: "id",
                        hasChildren: function (x) {
                            var id = x.id;

                            for (var i = 0; i < $scope.permissions.length; i++) {
                                if ($scope.permissions[i].parent == id) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
            },
        }

        $scope.saveTreeFields = function () {
            $scope.flgSave = true;

            var _permissions = [];

            var data = $scope.tree.dataSource.data();

            for (var i = 0, j = data.length; i < j; i++)
                checkChildren(data[i]);

            callApi.call($rootScope.urls.savePermissionCatalogsUrl, 'POST', {
                data: JSON.stringify({
                    userId: $scope.selectedUserId,
                    permissionCatalogs: _permissions
                })
            }, function (data) {
                $rootScope.showSuccess('', 'اطلاعات ذخیره گردید');
                $scope.flgSave = false;
            });

            function checkChildren(data) {
                if (data.checked)
                    _permissions.push({ id: data.id, grant: true });

                if (data.items !== undefined)
                    for (var i = 0, j = data.items.length; i < j; i++)
                        checkChildren(data.items[i]);
            }
        };

        $scope.resetTreeNodes = function () {
            var checkedData = [];

            var data = $scope.tree.dataSource.data();

            for (var i = 0, j = data.length; i < j; i++)
                checkChildren(data[i]);

            function checkChildren(data) {
                if (data.checked)
                    data.set("checked", false);

                if (data.items !== undefined)
                    for (var i = 0, j = data.items.length; i < j; i++)
                        checkChildren(data.items[i]);
            }
        };

        $scope.setTreeNodesCheck = function (userPermissions) {
            var checkedData = [];

            var data = $scope.tree.dataSource.data();

            for (var i = 0, j = data.length; i < j; i++)
                checkChildren(data[i]);

            function checkChildren(data) {

                var perms = $.grep(userPermissions, function (permission) {
                    return permission.grant && permission.permissionCatalogId == data.id;
                });

                if (perms.length > 0)
                    data.set("checked", true);

                if (data.items !== undefined)
                    for (var i = 0, j = data.items.length; i < j; i++)
                        checkChildren(data.items[i]);
            }
        };
    }
})();