(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('customercontroller', customercontroller);

    customercontroller.$inject = ['$scope', '$http', '$rootScope', '$location', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];


    function customercontroller($scope, $http, $rootScope, $location, authenticationService, callApi, callApiAnonymouslyService) {
        
        $scope.flLoading = false;
        (function initController() {
            //$location.path('/customer');
        })();

        var customersDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customersUrl, 'POST', null, function (response) {
                        console.log(response.data);
                        e.success(response.data)
                    }, function (response) {
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
                        customerType: { editable: false },
                        customerCode: { editable: false },
                        customerName: { editable: false },
                        customerGroup: { editable: false },
                        customerTier: { editable: false },
                        customerMobile: { editable: false },
                        customerCardNumber: { editable: false },
                        customerStatus: { editable: false },
                    }
                }
            }
        });
        $scope.customerGridOptions = {
            dataSource: customersDataSource,
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
            toolbar: kendo.template($("#toolbar-template").html()),
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "customerType", title: "نوع مشتری", width: 200 },
                { field: "customerCode", title: "کد مشتری", width: 250 },
                { field: "customerName", title: "نام مشتری", width: 150 },
                { field: "customerGroup", title: "گروه مشتری", width: 150 },
                { field: "customerTier", title: "سطح مشتری", width: 150 },
                { field: "customerMobile", title: "موبایل", width: 150 },
                { field: "customerCardNumber", title: "شماره کارت", width: 150 },
                { field: "customerStatus", title: "وضعیت", width: 150 },
                { command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.addCustomer = function () {
            $location.path('/customer/edit');
        };

        $scope.addQuickCustomer = function () {
            $location.path('/customer/addQuick')

        };

        $scope.selectedCustomer = null;
        $scope.selectingCustomer = function (data, dataItem, columns) {
            $scope.selectedCustomer = dataItem;
        };

        $scope.editCustomer = function () {
            if ($scope.selectedCustomer) {
                $location.path('/customer/edit/' + $scope.selectedCustomer.uniqueId);
            } else {
                $rootScope.showError('خطا', 'لطفا یک مشتری انتخاب کنید.');
            }
        };
    }

})();