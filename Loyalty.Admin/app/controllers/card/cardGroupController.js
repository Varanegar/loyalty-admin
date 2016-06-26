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
                    callApi.call($rootScope.urls.cardSetUrl, 'POST', null, function (response) {
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
                        loyaltyCardSetCode: { editable: false },
                        loyaltyCardSetName: { editable: false },
                        initialtext: { editable: false },
                        seed: { editable: false },
                        currentNo: { editable: false }
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
                { field: "loyaltyCardSetCode", title: "کد گروه", width: 200 },
                { field: "loyaltyCardSetName", title: "نام گروه", width: 200 },
                { field: "initialtext", title: "متن اولیه", width: 200 },
                { field: "seed", title: "شروع", width: 200 },
                { field: "currentNo", title: "شماره فعلی", width: 200 },
                //{ command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.selectedCardGroup = null;
        
        $scope.selectingCardGroup = function (data, dataItem, columns) {
            $scope.selectedCardGroup = dataItem;
        };

        $scope.addCard = function () {
            if ($scope.selectedCardGroup) {

            } else {
                $rootScope.showError('خطا', 'لطفا یک گروه کارت انتخاب کنید.');
            }
        };

        $scope.addCardGroup = function () {
            $location.path('/cardGroup/edit');
        };

        $scope.editCardGroup = function () {
            if ($scope.selectedCardGroup) {
                $location.path('/cardGroup/edit/' + $scope.selectedCardGroup.uniqueId);
            } else {
                $rootScope.showError('خطا', 'لطفا یک گروه کارت انتخاب کنید.');
            }
        };
    }
})();