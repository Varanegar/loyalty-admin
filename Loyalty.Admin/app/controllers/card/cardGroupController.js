(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('cardGroupController', cardGroupController);

    cardGroupController.$inject = ['$scope', '$http', '$rootScope', '$routeParams', '$location', 'callApi', 'authenticationService', 'callApiAnonymouslyService'];


    function cardGroupController($scope, $http, $rootScope, $routeParams, $location, callApi, authenticationService, callApiAnonymouslyService) {

        var cardGroupsDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    //callApi.call($rootScope.urls.customersUrl, 'POST', null, function (response) {
                    //    console.log(response.data);
                    //    e.success(response.data)
                    //}, function (response) {
                    //    console.log(response);
                    //});
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
                        groupName: { editable: false }
                    }
                }
            }
        });
        $scope.cardGroupsGridOptions = {
            dataSource: cardGroupsDataSource,
            selectable: true,
            // navigatable: true,
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
            toolbar: kendo.template($("#cardGroups-toolbar-template").html()),
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "groupName", title: "نوع مشتری", width: 200 },
                //{ command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

    }
})();