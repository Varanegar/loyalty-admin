(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('editCustomerController', editCustomerController);

    editCustomerController.$inject = ['$scope', '$http', '$rootScope', '$location', '$routeParams', 'authenticationService', 'callApi', 'callApiAnonymouslyService'];

    function editCustomerController($scope, $http, $rootScope, $location, $routeParams, authenticationService, callApi, callApiAnonymouslyService) {

        $scope.isEditMode = function () {
            return $routeParams['uid'] != null;
        }

        $scope.customer = {
            "customerCode": null,
            "customerName": null,
            "longitude": 0,
            "latitude": 0,
            "firstName": null,
            "lastName": null,
            "birthDay": null,
            "phone": null,
            "mobile": "",
            "email": "",
            "mainStreet": "",
            "otherStreet": "",
            "postalCode": "",
            "nationalCode": "",
            "regionInfoId": null,
            "regionLevel1Id": null,
            "regionLevel2Id": null,
            "regionLevel3Id": null,
            "regionLevel4Id": null,
            "defauleStoreId": null,
            "companyId": 'cf7c4810-9da0-433c-8639-21bdbd889c85', // dont ask me "why?" :|
            "customerTypeId": null,
            "pBirthDay": null,
            "marriageDate": null,
            "pMarriageDate": null,
            "graduateDate": null,
            "pGraduateDate": null,
            "reagentId": null,
            "currentTierId": null,
            "currentTierName": null,
            "currentCardId": null,
            "currentCardSerialNo": null,
            "currentCardSetId": null,
            "currentCardSet": null,
            "customerGroupId": null,
            "currentGroupName": null,
            "currentCardNo": null,
            "getNews": false,
            "getMessage": false,
            "id": 0,
            "uniqueId": "",
            "applicationOwnerId": "",
            "dataOwnerId": "",
            "dataOwnerCenterId": "",
            "isRemoved": false,
            "createdDate": "",
            "lastUpdate": ""
        };

        $scope.personTypeId = 'F8A0E103-CBB0-40EA-BF80-E2DBC552EE3C';
        $scope.companyTypeId = '770803A2-3F46-48D1-98D2-2D656F6297DD';

        $scope.countries = [];
        $scope.cities = [];
        $scope.regions = [];
        $scope.districts = [];
        $scope.tiers = [];

        $scope.cardSets = [];
        $scope.customerGroups = [];
        $scope.flLoading = false;

        $scope.onCountryChanged = function () {
            $scope.getRegions($scope.customer.regionLevel1Id, function (cities) {
                $scope.cities = cities.data;
                if (cities.data.length > 0) {
                    $scope.customer.regionLevel2Id = cities.data[0].uniqueId;
                    if ($scope.regions.length == 0)
                        $scope.onCityChanged();
                }
            });
        }

        $scope.onCityChanged = function () {
            $scope.getRegions($scope.customer.regionLevel2Id, function (regions) {
                $scope.regions = regions.data;
                if (regions.data.length > 0) {
                    $scope.customer.regionLevel3Id = regions.data[0].uniqueId;
                    if ($scope.districts.length == 0)
                        $scope.onRegionChanged();
                }
            });
        }

        $scope.onRegionChanged = function () {
            $scope.getRegions($scope.customer.regionLevel3Id, function (districts) {
                $scope.districts = districts.data;
                if (districts.data.length > 0)
                    $scope.customer.regionLevel4Id = districts.data[0].uniqueId;
            });
        }

        $scope.getRegions = function (parentId, onSuccess) {
            callApi.call($rootScope.urls.regionByParentIdUrl, 'POST', { parentUniqueId: parentId },
                onSuccess,
                function (error) {
                    console.log('error while trying to fetch region data. parentId: ' + parentId);
                    console.log('error detail: ' + error);
                });
        };

        $scope.getCustomerGroups = function () {
            callApi.call($rootScope.urls.customerGroupListUrl, 'POST', null,
                function (response) {
                    $scope.customerGroups = response.data;
                    if ($scope.customer && !$scope.customer.customerGroupId && response.data.length > 0) {
                        $scope.customer.customerGroupId = response.data[0].uniqueId;
                    }
                },
                function (error) {
                    console.log('error while trying to fetch region data. parentId: ' + parentId);
                    console.log('error detail: ' + error);
                });
        };

        $scope.getCustomerTiers = function () {
            callApi.call($rootScope.urls.customerTierListUrl, 'POST', null,
                function (response) {
                    $scope.tiers = response.data;
                    if ($scope.customer && !$scope.customer.currentTierId && response.data.length > 0) {
                        $scope.customer.currentTierId = response.data[0].uniqueId;
                    }
                },
                function (error) {
                    console.log('error while trying to fetch tier data.');
                    console.log('error detail: ' + error);
                });
        };

        $scope.getCardGroups = function () {
            callApi.call($rootScope.urls.cardSetUrl, 'POST', null,
                function (response) {
                    $scope.cardSets = response.data;
                    if ($scope.customer && !$scope.customer.currentCardSetId && response.data.length > 0) {
                        $scope.customer.currentCardSetId = response.data[0].uniqueId;
                    }
                },
                function (error) {
                    console.log('error while trying to fetch region data. parentId: ' + parentId);
                    console.log('error detail: ' + error);
                });
        };

        $scope.save = function () {
            callApi.call($rootScope.urls.customerSaveUrl, 'POST', JSON.stringify({ customerData: $scope.customer }),
                function (response) {
                    // success 
                    $scope.customers();
                }, function (error) {
                    // faild
                });

        };

        $scope.customers = function () {
            $location.path('/customer/list');
        };


        var customerActivityDataSource = new kendo.data.DataSource({
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
                        date: { editable: false },
                        action: { editable: false },
                        location: { editable: false },
                        user: { editable: false },
                        terminal: { editable: false },
                        description: { editable: false }
                    }
                }
            }
        });
        $scope.customerActivityGridOptions = {
            dataSource: customerActivityDataSource,
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
            toolbar: null,
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "date", title: "تاریخ", width: 200 },
                { field: "action", title: "اقدام", width: 250 },
                { field: "location", title: "مکان", width: 150 },
                { field: "user", title: "کاربر", width: 150 },
                { field: "terminal", title: "ترمینال", width: 150 },
                { field: "description", title: "توضیحات", width: 150 }
            ]
        };

        var customerFinancialActivityDataSource = new kendo.data.DataSource({
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
                        date: { editable: false },
                        transaction: { editable: false },
                        realPrice: { editable: false },
                        unrealPrice: { editable: false },
                        discount: { editable: false },
                        location: { editable: false },
                        user: { editable: false },
                        terminal: { editable: false },
                        description: { editable: false }
                    }
                }
            }
        });
        $scope.customerFinancialActivityGridOptions = {
            dataSource: customerActivityDataSource,
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
            toolbar: null,
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "date", title: "تاریخ", width: 200 },
                { field: "transaction", title: "تراکنش", width: 250 },
                { field: "realPrice", title: "مبلغ خالص", width: 150 },
                { field: "unrealPrice", title: "مبلغ ناخالص", width: 150 },
                { field: "discount", title: "تخفیف", width: 150 },
                { field: "location", title: "مکان", width: 150 },
                { field: "user", title: "کاربر", width: 150 },
                { field: "terminal", title: "ترمینال", width: 150 },
                { field: "description", title: "توضیحات", width: 150 }
            ]
        };

        var customerActivityHistoryDataSource = new kendo.data.DataSource({
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
                        date: { editable: false },
                        feature: { editable: false },
                        initial: { editable: false },
                        incremental: { editable: false },
                        decremental: { editable: false },
                        final: { editable: false }
                    }
                }
            }
        });
        $scope.customerActivityHistoryGridOptions = {
            dataSource: customerActivityDataSource,
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
            toolbar: null,
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "date", title: "تاریخ", width: 200 },
                { field: "feature", title: "ویژگی برنامه", width: 250 },
                { field: "initial", title: "مقدار اولیه", width: 150 },
                { field: "incremental", title: "مقدار افزایشی", width: 150 },
                { field: "decremental", title: "مقدار کاهشی", width: 150 },
                { field: "final", title: "مقدار نهایی", width: 150 }
            ]
        };


        (function initController() {
            $scope.flLoading = true;

            // init country drop down
            $scope.getRegions(null, function (countries) {
                $scope.countries = countries.data;
                //$scope.getRegions()
            });

            $scope.getCustomerGroups();
            $scope.getCardGroups();
            $scope.getCustomerTiers();

            if ($routeParams.uid) {
                // edit mode
                callApi.call($rootScope.urls.customerByIdUrl, 'POST', { customerId: $routeParams.uid }, function (response) {
                    console.log(response);
                    $scope.customer = response.data;
                }, function () { });
            } else {
                // new mode
            }

        })();
    }
})();
