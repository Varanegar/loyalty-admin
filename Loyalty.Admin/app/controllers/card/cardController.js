(function () {
    'use strict';

    angular
           .module('membersApp')
           .controller('cardController', cardController);

    cardController.$inject = ['$scope', '$http', '$rootScope', '$routeParams', '$location', 'callApi', 'authenticationService', 'callApiAnonymouslyService'];


    function cardController($scope, $http, $rootScope, $routeParams, $location, callApi, authenticationService, callApiAnonymouslyService) {
        $scope.flLoading = false;
        $scope.selectedCard = null;

        var cardsDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    callApi.call($rootScope.urls.customerCardsUrl, 'POST', { customerId: $routeParams.uid }, function (response) {
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
                        cardNo: { editable: false },
                        loyaltyCardSetName: { editable: false },
                        assignDate: { editable: false },
                        isActive: { editable: false }
                    }
                }
            }
        });
        $scope.cardGridOptions = {
            dataSource: cardsDataSource,
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
            toolbar: kendo.template($("#cards-toolbar-template").html()),
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "cardNo", title: "شماره کارت", width: 200 },
                { field: "loyaltyCardSetName", title: "گروه کارت", width: 250 },
                { field: "assignDate", title: "تاریخ آخرین تغییر", width: 150 },
                { field: "isActive", title: "وضعیت", width: 150 }
                //{ command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.addCard = function () {
            $location.path('/card/edit/' + $routeParams.uid);
        };

        $scope.cards = function () {
            $location.path('/card');
        }

        $scope.toggleCardStatus = function () {
            if ($scope.selectedCard) {

            } else {
                $rootScope.showError('خطا', 'لطفا یک کارت انتخاب کنید.');
            }
        };

        $scope.disposeCard = function () {
            if ($scope.selectedCard) {

            } else {
                $rootScope.showError('خطا', 'لطفا یک کارت انتخاب کنید.');
            }
        };

        $scope.customers = function () {
            $location.path('/customer/list');
        };


        $scope.selectingCard = function (data, dataItem, columns) {
            $scope.selectedCard = dataItem;
        };


        (function initController() {
        })();
    }

})();