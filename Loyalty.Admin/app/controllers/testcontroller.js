(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('testcontroller', testcontroller);

    testcontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function testcontroller($scope, $location, $rootScope, toaster, callApi) {
        $scope.testDate = '';

        $scope.searchTerm = '';
        $scope.selectedCustomer = '';

        $scope.customersDataSource = {
            serverFiltering: true,
            transport: {
                read:
                    function (e) {
                        callApi.call($rootScope.urls.customersSearchUrl, 'Post', {
                            searchTerm: $scope.searchTerm
                        }, function (response) {
                            e.success(response.data)
                        });
                    }
            }
        };

        $scope.customerOptions = {
            dataSource: $scope.customersDataSource,
            dataTextField: "customerName",
            minLength: 2,
            delay: 500,
            filter: "contains",
            placeholder: "کد یا موبایل مشتری",
            select: function (e) {
                var dataItem = this.dataItem(e.item.index());

                $scope.selectedCustomer = dataItem;
            },
            template: 'نام: #: customerName#, کدمشتری: #: customerCode#, موبایل: #: mobile#',
            //headerTemplate: '<div class="dropdown-header">' +
            //'<span class="k-widget k-header">Photo</span>' +
            //'<span class="k-widget k-header">Contact info</span>' +
            //'</div>',
            //// using  templates:
            //template: '<span class="k-state-default"><img src=\"\" alt=\"\" /></span>' +
            //'<span class="k-state-default"><h3></h3><p></p></span>',
        };
    }
})();