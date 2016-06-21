(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('userscontroller', userscontroller);

    userscontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function userscontroller($scope, $location, $rootScope, toaster, callApi) {
        //$rootScope.showError('', 'asd');
        var ds = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.usersUrl, 'GET', null, function success(response) {
                        e.success(response.data)
                    }, function error(response) {
                        $rootScope.showAjaxError(response);
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
    }
})();