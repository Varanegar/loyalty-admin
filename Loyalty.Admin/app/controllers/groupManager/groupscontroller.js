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

        $scope.add = function () {
           // $location.path('/userManager/edit');
        }

        $scope.selectedGroup = '';
        $scope.selectingGroups = function (data, dataItem, columns) {
            $scope.selectedGroup = dataItem;
        };

        $scope.edit = function (e) {
            //if ($scope.selectedUser)
            //    $location.path('/groupManager/edit/' + $scope.selectedUser.id);
            //else
            //    $rootScope.showError('', 'لطفا ابتدا کاربر موردنظر را انتخاب نمایید');
        }

        $scope.delete = function () {
            if ($scope.selectedGroup) {
                callApi.call($rootScope.urls.removeGroupUrl, 'POST', {
                    userGroupData: $scope.selectedGroup
                }, function (response) {
                    $rootScope.showSuccess('', 'گروه مورد نظر حذف گردید');
                });
            }
            else
                $rootScope.showError('', 'لطفا ابتدا گروه مورد نظر را انتخاب نمایید');
        }

        $scope.groupUsers = function () {

        }

        $scope.groupPermissions = function () {

        }
    }
})();