(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('customerTierController', customerTierController);

    customerTierController.$inject = ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function customerTierController($scope, $http, $rootScope, $location, $routeParams, authenticationService, callApi, callApiAnonymouslyService) {

        // data source
        var tiersDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.tierListUrl, 'POST', null, function (response) {
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
                    id: "uniqueId",
                    fields: {
                        uniqueId: { editable: false, nullable: false },
                        tierCode: { editable: false },
                        tierName: { editable: false }
                    }
                }
            }
        });
        $scope.tierGridOptions = {
            dataSource: tiersDataSource,
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
            toolbar: kendo.template($("#customers-toolbar-template").html()),
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "tierCode", title: "کد سطح", width: 250 },
                { field: "tierName", title: "نام سطح", width: 250 },
                //{ command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.selectedTier = null;
        $scope.selectingTier = function (data, dataItem, columns) {
            $scope.selectedTier = dataItem;
        };


        $scope.addTier = function () {
            $location.path('/tiers/edit')
        };

        $scope.editTier = function () {
            if (!$scope.selectedTier) {
                $rootScope.showError('خطا', 'لطفا یک سطح مشتری انتخاب کنید.');
                return;
            }
        };

        $scope.removeTier = function () {
            if (!$scope.selectedTier) {
                $rootScope.showError('خطا', 'لطفا یک سطح مشتری انتخاب کنید.');
                return;
            }
        };

        (function initController() {

        })();
    }
})();
