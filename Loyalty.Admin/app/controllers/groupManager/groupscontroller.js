(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('groupscontroller', groupscontroller);

    groupscontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function groupscontroller($scope, $location, $rootScope, toaster, callApi) {
        var ds = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.groupsUrl, 'POST', null, function (response) {
                        e.success(response.data)
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
                        groupName: { editable: false },
                    }
                }
            }
        });
        $scope.groupsGridOptions = {
            dataSource: ds,
            selectable: true,
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
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "userGroupCode", title: "کد گروه", width: 200 },
                { field: "userGroupName", title: "نام گروه", width: 200 },
            ]
        };

        $scope.groupName = '';

        $scope.selectedGroup = '';
        $scope.selectingGroups = function (data, dataItem, columns) {
            $scope.selectedGroup = dataItem;
        };

        $scope.edit = function (e) {
            if ($scope.selectedGroup != '')
                $scope.groupName = $scope.selectedGroup.userGroupName;
            else
                $rootScope.showError('', 'لطفا ابتدا گروه مورد نظر را انتخاب نمایید');
        }

        var refreshGrid = function () {
            $scope.grid.dataSource.read();
            $scope.grid.refresh();
        }

        $scope.save = function (e) {
            if ($scope.selectedGroup != '') {
                $scope.selectedGroup.userGroupName = $scope.groupName;
                callApi.call($rootScope.urls.saveGroupUrl, 'POST', {
                    userGroupData: $scope.selectedGroup
                }, function (response) {
                    $rootScope.showSuccess('', 'گروه مورد نظر ذخیره گردید');
                    $scope.groupName = '';
                    $scope.selectedGroup = '';
                    refreshGrid();
                });
            }
            else {
                callApi.call($rootScope.urls.saveGroupUrl, 'POST', {
                    userGroupData: {
                        uniqueId: $rootScope.newGuid(),
                        userGroupName: $scope.groupName
                    }
                }, function (response) {
                    $scope.groupName = '';
                    $rootScope.showSuccess('', 'گروه مورد نظر ثبت گردید');
                    refreshGrid();
                });
            }
        }

        $scope.delete = function () {
            if ($scope.selectedGroup) {
                callApi.call($rootScope.urls.removeGroupUrl, 'POST', {
                    userGroupData: $scope.selectedGroup
                }, function (response) {
                    $rootScope.showSuccess('', 'گروه مورد نظر حذف گردید');
                    $scope.selectedGroup = '';
                    refreshGrid();                   
                });
            }
            else
                $rootScope.showError('', 'لطفا ابتدا گروه مورد نظر را انتخاب نمایید');
        }

        $scope.groupUsers = function () {
            if ($scope.selectedGroup != '')
                $location.path(String.format('/groupUsers/{0}/{1}', $scope.selectedGroup.userGroupName, $scope.selectedGroup.uniqueId));
            else
                $rootScope.showError('', 'لطفا ابتدا گروه مورد نظر را انتخاب نمایید');
        }

        $scope.groupPermissions = function () {
            if ($scope.selectedGroup != '')
                $location.path(String.format('/groupPermissions/{0}/{1}', $scope.selectedGroup.userGroupName, $scope.selectedGroup.uniqueId));
            else
                $rootScope.showError('', 'لطفا ابتدا گروه مورد نظر را انتخاب نمایید');
        }
    }
})();