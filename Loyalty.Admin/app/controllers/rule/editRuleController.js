(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('editRuleController', editRuleController);

    editRuleController.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];


    function editRuleController($scope, $http, $rootScope, $location, authenticationService, callApi, callApiAnonymouslyService) {

        $scope.rule = {};

        $scope.ruleGroupDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.ruleGroupsUrl, 'POST', null, function (response) {
                        e.success(response.data);
                    });
                },
            }
        });


        $scope.ruleTypeDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.ruleTypesUrl, 'POST', null, function (response) {
                        e.success(response.data);
                    });
                },
            }
        });

        $scope.triggerTypesDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.triggerTypesUrl, 'POST', null, function (response) {
                        e.success(response.data);
                    });
                },
            }
        });


        $scope.ranges = [];
        var rangesDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success($scope.ranges);
                },
                create: function (e) {
                    $scope.ranges.push(e.data);
                    e.success($scope.ranges);
                },
                update: function (e) {
                    e.success();
                    //$scope.ranges.push(e.data);
                    //e.success(e.data);
                },
                destroy: function (e) {
                    e.success();
                    //$scope.ranges.pop(e.data);
                    //e.success(e.data);
                },
                parameterMap: function (options, operation) {
                    if (operation == "read")
                        return kendo.stringify(options);
                }
            },
            batch: true,
            pageSize: 20,
            requestEnd: null,
            schema: {
                model: {
                    id: "uniqueId",
                    fields: {
                        uniqueId: { editable: false, nullable: true },
                        fromNumber: { editable: true },
                        toNumber: { editable: true },
                        step: { editable: true },
                    }
                }
            }
        });
        $scope.rangesGridOptions = {
            dataSource: rangesDataSource,
            selectable: true,
            // navigatable: true,
            resizable: true,
            sortable: true,
            filterable: false,
            pageable: false,
            toolbar: ["create"],
            height: 500,
            editable: "inline",
            dataBinding: onGridDataBinding,
            columns: [
                { field: "fromNumber", title: "از شماره", type: "number", validation: { required: true } },
                { field: "toNumber", title: "تا شماره", type: "number", validation: { required: true } },
                { field: "step", title: "گام", type: "number", validation: { required: true } },
                { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }
            ]
        };

        $scope.productGroupOptions = {
            placeholder: "گروه های کالای مورد نظر را وارد نمایید",
            dataTextField: "name",
            dataValueField: "uniqueId",
            valuePrimitive: true,
            autoClose: false,
            autoBind: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success([
                            { uniqueId: 1, name: 'گروه 1' },
                            { uniqueId: 2, name: 'گروه 2' }
                        ]);
                    },
                }
            },
            headerTemplate: '<div class="row k-widget k-header">' +
                                '<div class="col-xs-3">گروه کالا</div>' +
                            '</div>',

            template: '<div class="row" >' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.name #</h4></div>' +
                       '</div>',
            select: function (e) {

                var dataItem = this.dataItem(e.item.index());

                //$scope.selectedCustomer = dataItem;
            },
        };

        $scope.productOptions = {
            placeholder: "کالا های مورد نظر را وارد نمایید",
            dataTextField: "name",
            dataValueField: "uniqueId",
            valuePrimitive: true,
            autoClose: false,
            autoBind: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        e.success([
                            { uniqueId: 1, name: 'کالای 1' },
                            { uniqueId: 2, name: 'کالای 2' },
                            { uniqueId: 3, name: 'کالای 3' }
                        ]);
                    },
                }
            },
            headerTemplate: '<div class="row k-widget k-header">' +
                                '<div class="col-xs-3">نام کالا</div>' +
                            '</div>',

            template: '<div class="row" >' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.name #</h4></div>' +
                       '</div>',
            select: function (e) {

                var dataItem = this.dataItem(e.item.index());

                //$scope.selectedCustomer = dataItem;
            },
        };


        $scope.triggerOptions = {
            placeholder: "محرک های مورد نظر را وارد نمایید",
            dataTextField: "loyaltyTriggerName",
            dataValueField: "uniqueId",
            valuePrimitive: true,
            autoClose: false,
            autoBind: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        callApi.call($rootScope.urls.triggersUrl, 'POST', null, function success(response) {
                            e.success(response.data);
                        });
                    },
                }
            },
            headerTemplate: '<div class="row k-widget k-header">' +
                                '<div class="col-xs-3">کد محرک</div>' +
                                '<div class="col-xs-3">نام محرک</div>' +
                            '</div>',

            template: '<div class="row" >' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.loyaltyTriggerCode #</h4></div>' +
                                '<div class="col-xs-3 k-state-default"><h4>#: data.loyaltyTriggerName #</h4></div>' +
                       '</div>',
            select: function (e) {

                var dataItem = this.dataItem(e.item.index());

                //$scope.selectedCustomer = dataItem;
            },
        };

        $scope.valueTypesDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.valueTypesUrl, 'POST', null, function (response) {
                        e.success(response.data);
                    });
                },
            }
        });

        $scope.selectedTypeKey = '';

        $scope.save = function () {

        };

        $scope.rules = function () {
            $location.path('/rules/');
        };
    }
})();