(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('userscontroller', userscontroller);

    userscontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster'];

    function userscontroller($scope, $location, $rootScope, toaster) {
        $scope.userGridOptions = {
            dataSource: new kendo.data.DataSource({
                transport: {
                    read: {
                        url: $rootScope.urls.usersUrl,
                        dataType: "json",
                        contentType: "application/json",
                        type: "Get",
                        beforeSend: $rootScope.gridAuthHeader
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
            }),
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
            dataBinding: $rootScope.onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#= renderNumber(data) #", filterable: false, },
                { field: "userName", title: "نام کاربری", width: 200 },
                { field: "email", title: "ایمیل", width: 250 },
                { field: "mobile", title: "شماره تلفن", width: 150 },
                { command: { text: "ویرایش", click: self.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.addUser = function () {
            $location.path('/userManager/edit');
        }
    }
})();