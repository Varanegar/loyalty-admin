(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('userscontroller', userscontroller);

    userscontroller.$inject = ['$scope'];

    function userscontroller($scope) {
        $scope.userGridOptions = {
            dataSource: {
                type: "odata",
                transport: {
                    read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
                },
                pageSize: 5,
                serverPaging: true,
                serverSorting: true
            },
            sortable: true,
            pageable: true,
            dataBound: function () {
                this.expandRow(this.tbody.find("tr.k-master-row").first());
            },
            columns: [{
                field: "FirstName",
                title: "First Name",
                width: "120px"
            }, {
                field: "LastName",
                title: "Last Name",
                width: "120px"
            }, {
                field: "Country",
                width: "120px"
            }, {
                field: "City",
                width: "120px"
            }, {
                field: "Title"
            }]
        };
    }
})();