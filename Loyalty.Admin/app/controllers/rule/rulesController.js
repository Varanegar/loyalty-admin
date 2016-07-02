(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('rulesController', rulesController);

    rulesController.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function rulesController($scope, $location, $rootScope, toaster, callApi) {

        $scope.mockedRules = [
            { uniqueId: 1, type: 'نوع 1', ruleName: 'قانون اول', ruleGroupName: 'قوانین عمومی', ruleStatus: 'فعال' },
            { uniqueId: 2, type: 'نوع 1', ruleName: 'قانون دوم', ruleGroupName: 'قوانین عمومی', ruleStatus: 'فعال' },
            { uniqueId: 3, type: 'نوع 1', ruleName: 'قانون سوم', ruleGroupName: 'قوانین عمومی', ruleStatus: 'غیر فعال' },
        ];

        var rulesDataSource = new kendo.data.DataSource({
            transport: {
                read: function (e) {
                    e.success($scope.mockedRules);
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
                        type: { editable: false },
                        ruleName: { editable: false },
                        ruleGroupName: { editable: false },
                        ruleStatus: { editable: false }
                    }
                }
            }
        });
        $scope.ruleGridOptions = {
            //dataSource: rulesDataSource,
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
            toolbar: kendo.template($("#rules-toolbar-template").html()),
            height: 500,
            //editable: false,
            dataBinding: onGridDataBinding,
            columns: [
                { field: "rowNo", title: "#", width: 70, template: "#: renderNumber(data) #", filterable: false, },
                { field: "ruleName", title: "عنوان قانون", width: 250 },
                { field: "ruleGroupName", title: "گروه قانون", width: 150 },
                { field: "type", title: "نوع", width: 200 },
                { field: "ruleStatus", title: "وضعیت", width: 150 },
                //{ command: { text: "ویرایش", click: $scope.showEdit }, title: " ", width: "180px" }
            ]
        };

        $scope.selectedRule = null;
        $scope.selectingRule = function (data, dataItem, columns) {
            $scope.selectedRule = dataItem;
        };


        $scope.addRule = function () {
            $location.path('/rules/edit/');
        };

        $scope.editRule = function () {
            if (!$scope.selectedRule) {
                $rootScope.showError('خطا', 'لطفا یک قانون انتخاب کنید.');
                return;
            }

            $location.path('/rules/edit/' + $scope.selectedRule.uniqueId);
        };

        $scope.removeRule = function () {
            if (!$scope.selectedRule) {
                $rootScope.showError('خطا', 'لطفا یک قانون انتخاب کنید.');
                return;
            }
        };
    }
})();