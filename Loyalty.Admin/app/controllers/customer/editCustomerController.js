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

        $scope.regionLevel1DataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    $scope.getRegions(null, function (countries) {
                        e.success($scope.countries);
                    });
                },
            }
        });

        $scope.regionLevel2DataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    $scope.getRegions($scope.customer.regionLevel1Id, function (cities) {
                        e.success(cities.data);
                    });
                },
            }
        });

        $scope.regionLevel3DataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    $scope.getRegions($scope.customer.regionLevel2Id, function (regions) {
                        e.success(regions.data);
                    });
                },
            }
        });

        $scope.regionLevel4DataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    $scope.getRegions($scope.customer.regionLevel3Id, function (districts) {
                        e.success(districts.data);
                    });
                },
            }
        });


        $scope.tiers = [];
        $scope.customerTierDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerTierListUrl, 'POST', null,
                        function (response) {
                            $scope.tiers = response.data;
                            e.success(response.data);
                            if ($scope.customer && !$scope.customer.currentTierId && response.data.length > 0) {
                                $scope.customer.currentTierId = response.data[0].uniqueId;
                            }
                        },
                        function (error) {
                            //console.log('error while trying to fetch tier data.');
                            //console.log('error detail: ' + error);
                        });
                },
            }
        });

        $scope.cardSets = [];
        $scope.cardSetDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.cardSetUrl, 'POST', null,
                        function (response) {
                            $scope.cardSets = response.data;
                            e.success(response.data);
                            if ($scope.customer && !$scope.customer.currentCardSetId && response.data.length > 0) {
                                $scope.customer.currentCardSetId = response.data[0].uniqueId;
                            }
                        },
                        function (error) {
                            //console.log('error while trying to fetch region data. parentId: ' + parentId);
                            //console.log('error detail: ' + error);
                        });
                },
            }
        });

        $scope.customerGroups = [];
        $scope.customerGroupDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerGroupListUrl, 'POST', null,
                        function (response) {
                            $scope.customerGroups = response.data;
                            e.success(response.data);
                            if ($scope.customer && !$scope.customer.customerGroupId && response.data.length > 0) {
                                $scope.customer.customerGroupId = response.data[0].uniqueId;
                            }
                        },
                        function (error) {
                            //console.log('error while trying to fetch region data. parentId: ' + parentId);
                            //console.log('error detail: ' + error);
                        });
                },
            }
        });

        $scope.customerReagentDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerReagentFindUrl, 'POST', { searchTerm: $('').val() },
                        function (response) {
                            $scope.tiers = response.data;
                            e.success(response.data);
                            if ($scope.customer && !$scope.customer.reagentId && response.data.length > 0) {
                                $scope.customer.reagentId = response.data[0].uniqueId;
                            }
                        },
                        function (error) {
                            //console.log('error while trying to fetch tier data.');
                            //console.log('error detail: ' + error);
                        });
                },
            }
        });

        $scope.flLoading = false;

        $scope.onCountryChanged = function () {
            $scope.regionLevel2DataSource.read();
            $scope.regionLevel3DataSource.read();
            $scope.regionLevel4DataSource.read();
        }

        $scope.onCityChanged = function () {
            $scope.regionLevel3DataSource.read();
            $scope.regionLevel4DataSource.read();
        }

        $scope.onRegionChanged = function () {
            $scope.regionLevel4DataSource.read();
        }

        $scope.getRegions = function (parentId, onSuccess) {
            callApi.call($rootScope.urls.regionByParentIdUrl, 'POST', { parentUniqueId: parentId },
                onSuccess,
                function (error) {
                    //console.log('error while trying to fetch region data. parentId: ' + parentId);
                    //console.log('error detail: ' + error);
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
                    //console.log('error while trying to fetch region data. parentId: ' + parentId);
                    //console.log('error detail: ' + error);
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
                    //console.log('error while trying to fetch tier data.');
                    //console.log('error detail: ' + error);
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
                    //console.log('error while trying to fetch region data. parentId: ' + parentId);
                    //console.log('error detail: ' + error);
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

        // reagent 
        $scope.reagentSearchTerm = '';
        $scope.selectedReagent = '';

        $scope.customersDataSource = {
            serverFiltering: true,
            transport: {
                read:
                    function (e) {
                        callApi.call($rootScope.urls.customersSearchUrl, 'Post', {
                            searchTerm: $scope.reagentSearchTerm
                        }, function (response) {
                            e.success(response.data)
                        });
                    }
            }
        };

        $scope.reagentOptions = {
            dataSource: $scope.customersDataSource,
            dataTextField: "customerName",
            minLength: 2,
            delay: 500,
            filter: "contains",
            placeholder: "کد یا موبایل مشتری",
            select: function (e) {
                var dataItem = this.dataItem(e.item.index());
                $scope.selectedReagent = dataItem;
                if (dataItem)
                    $scope.customer.reagentId = dataItem.uniqueId;
                else
                    $scope.customer.reagentId = null;
            },
            template: 'نام: #: customerName#, کدمشتری: #: customerCode#, موبایل: #: mobile#',
        };

        var customerActivityDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerTransactionHistoryUrl, 'POST', {
                        customerTransactionHistoryData:
                            {
                                customerId: $routeParams.uid,
                                loyaltyValueTypeId: 'F84E6BCC-10D0-49FC-A9D8-F6DC9E8F15A0'
                            }
                    }, function (response) {
                        //console.log(response.data);
                        e.success(response.data)
                    }, function (response) {
                        //console.log(response);
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
                        uniqueId: { editable: false, nullable: true },
                        activityPDate: { editable: false },
                        activityDesc: { editable: false },
                        placeDesc: { editable: false },
                        userId: { editable: false },
                        terminalDesc: { editable: false },
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
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "activityPDate", title: "تاریخ", width: 200 },
                { field: "activityDesc", title: "اقدام", width: 250 },
                { field: "placeDesc", title: "مکان", width: 150 },
                { field: "userId", title: "کاربر", width: 150 },
                { field: "terminalDesc", title: "ترمینال", width: 150 },
                { field: "description", title: "توضیحات", width: 150 }
            ]
        };

        var customerFinancialActivityDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerFinancialHistoryUrl, 'POST', JSON.stringify(
                        {
                            customerMonetaryHistoryData: {
                                customerId: $routeParams.uid
                            }
                        }), function (response) {
                            console.log(response.data);
                            e.success(response.data)
                        }, function (response) {
                            //console.log(response);
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
                        transactionPDate: { editable: false },
                        transactionDesc: { editable: false },
                        netAmount: { editable: false },
                        amount: { editable: false },
                        discount: { editable: false },
                        placeDesc: { editable: false },
                        user: { editable: false },
                        terminalDesc: { editable: false },
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
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "transactionPDate", title: "تاریخ", width: 200 },
                { field: "transactionDesc", title: "تراکنش", width: 250 },
                { field: "netAmount", title: "مبلغ خالص", width: 150 },
                { field: "amount", title: "مبلغ ناخالص", width: 150 },
                { field: "discount", title: "تخفیف", width: 150 },
                { field: "placeDesc", title: "مکان", width: 150 },
                { field: "user", title: "کاربر", width: 150 },
                { field: "terminalDesc", title: "ترمینال", width: 150 },
                { field: "description", title: "توضیحات", width: 150 }
            ]
        };

        var customerActivityHistoryDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerNonFinancialHistoryUrl, 'POST', JSON.stringify({
                        customerNonMonetaryHistoryData: { customerId: $routeParams.uid }
                    }), function (response) {
                        console.log(response.data);
                        e.success(response.data)
                    }, function (response) {
                        //console.log(response);
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
                        uniqueId: { editable: false, nullable: true },
                        transactionPDate: { editable: false },
                        description: { editable: false },
                        firstValue: { editable: false },
                        increaseValue: { editable: false },
                        decreaseValue: { editable: false },
                        finalValue: { editable: false }
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
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "transactionPDate", title: "تاریخ", width: 200 },
                { field: "description", title: "ویژگی برنامه", width: 250 },
                { field: "firstValue", title: "مقدار اولیه", width: 150 },
                { field: "increaseValue", title: "مقدار افزایشی", width: 150 },
                { field: "decreaseValue", title: "مقدار کاهشی", width: 150 },
                { field: "finalValue", title: "مقدار نهایی", width: 150 }
            ]
        };


        // init country drop down
        $scope.getRegions(null, function (countries) {
            $scope.countries = countries.data;
            if ($scope.customer.regionLevel1Id)
                $scope.onCountryChanged();
        });

        $scope.getCustomerGroups();
        $scope.getCardGroups();
        $scope.getCustomerTiers();

        if ($routeParams.uid) {
            // edit mode
            callApi.call($rootScope.urls.customerByIdUrl, 'POST', { customerId: $routeParams.uid }, function (response) {
                //console.log(response);
                if (response.data.length > 0)
                    $scope.customer = response.data[0];
            }, function () { });
            //customerActivityDataSource.read();
            //$scope.activityGrid.refresh();

            //customerFinancialActivityDataSource.read();
            //$scope.financialGrid.refresh();

            //customerActivityHistoryDataSource.read();
            //$scope.activityHistoryGrid.refresh();
        } else {
            // new mode
        }
    }
})();
