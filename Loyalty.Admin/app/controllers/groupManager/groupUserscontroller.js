(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('groupUserscontroller', groupUserscontroller);

    groupUserscontroller.$inject = ['$scope', '$location', '$rootScope', '$routeParams', 'toaster', 'callApi'];

    function groupUserscontroller($scope, $location, $rootScope, $routeParams, toaster, callApi) {
        $scope.groupId = $routeParams.gid;
        $scope.groupName = $routeParams.gname;

        $scope.selectedUserIds = [];

        $scope.userMultiSelectOptions = {
            placeholder: "کاربران مورد نظر راانتخاب نمایید",
            dataTextField: "userName",
            dataValueField: "id",
            valuePrimitive: true,
            autoClose: false,
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
                //var dataItem = this.dataItem(e.item.index());

                //$scope.selectedCustomer = dataItem;
            },
        };

        $scope.save = function () {
            callApi.call($rootScope.urls.addUserToGroupUrl, 'POST', {
                userGroupData: {
                    userGroupData: {
                        userGroupId: $scope.groupId,
                        userIds: $scope.selectedUserIds
                    }
                }
            }, function (response) {
                $rootScope.showSuccess('', 'اطلاعات ثبت گردید');
            });
        }

        $scope.cancel = function () {
            $location.path('/groups');
        }
    }
})();