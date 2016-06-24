(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('customergroupcontroller', customergroupcontroller);

    customergroupcontroller.$inject = ['$scope', '$location', '$rootScope', 'toaster', 'callApi'];

    function customergroupcontroller($scope, $location, $rootScope, toaster, callApi) {
        //TreeView
        $scope.customergroups = [];
        $scope.selectedItem = '';
        $scope.groupName = '';

        $scope.pendingGroups = [];

        var trvRead = function (e) {
            var id = e.data.uniqueId || "";

            e.success($.grep($scope.customergroups, function (x) {
                return x.parentUniqueIdString == id;
            }));
        }

        $scope.customerGroupsOptions = {
            dataTextField: "groupName",
            loadOnDemand: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        if ($scope.customergroups.length == 0)
                            callApi.call($rootScope.urls.customerGroupsUrl, 'POST', null, function (response) {
                                $scope.customergroups = response.data;

                                trvRead(e);

                                //select the root node
                                $scope.tree.select($scope.tree.findByText($scope.tree.root[0].textContent));
                            });
                        else
                            trvRead(e);
                    }
                },
                schema: {
                    model: {
                        id: "uniqueId",
                        hasChildren: function (x) {
                            var id = x.id;

                            for (var i = 0; i < $scope.customergroups.length; i++) {
                                if ($scope.customergroups[i].parentUniqueIdString == id) {
                                    return true;
                                }
                            }
                            return false;
                        }
                    }
                }
            },
        }

        function makeItem() {
            var model = { uniqueId: $rootScope.newGuid(), parentUniqueIdString: $scope.selectedItem.uniqueId, groupName: $scope.groupName };

            $scope.pendingGroups.push(model);

            return model;
        };

        function checkGroupName() {
            var items = $.grep($scope.customergroups, function (x) {
                return x.groupName == $scope.groupName;
            });

            var pendingItems = $.grep($scope.pendingGroups, function (x) {
                return x.groupName == $scope.groupName;
            });

            if (items.length > 0 || pendingItems.length > 0) {
                $rootScope.showError('', 'نام وارد شده تکراری است');

                return true;
            }
            return false
        }

        $scope.addBelow = function () {
            if (checkGroupName())
                return;

            var newItem = makeItem();

            $scope.tree.append(newItem, $scope.tree.select());

            $scope.groupName = '';
        };

        $scope.remove = function (item) {
            if (item.parentUniqueIdString == "") {
                $rootScope.showError('', 'شما مجاز به حذف این آیتم نمی باشید!');
                return;
            }

            var pendingItem = getFromPendingList(item);
            if (pendingItem != null)
                removeFromPendingList(pendingItem);
            else {
                //todo: remove from server!
            }

            var array = item.parent();
            var index = array.indexOf(item);
            array.splice(index, 1);

            $scope.selectedItem = $scope.customergroups[0];
            //select the root node
            $scope.tree.select($scope.tree.findByText($scope.tree.root[0].textContent));
        };

        function getFromPendingList(item) {
            var pendingItem = $.grep($scope.pendingGroups, function (x) {
                return x.uniqueId == item.uniqueId;
            });

            if (pendingItem.length > 0)
                return pendingItem[0];
            else
                return null;
        }

        function removeFromPendingList(item) {
            var items = $.grep($scope.pendingGroups, function (x) {
                return x.parentUniqueIdString == item.uniqueId;
            });

            if (items.length !== 0) {
                items.forEach(function (itm) {
                    removeFromPendingList(itm);
                });
            }
            var pendingIndex = $scope.pendingGroups.indexOf(item);
            $scope.pendingGroups.splice(pendingIndex, 1);
        }

        $scope.save = function () {
            debugger
            var model = []
            $scope.pendingGroups.forEach(function (itm) {
                model.push({
                    UniqueIdString: itm.uniqueId,
                    GroupName: itm.groupName,
                    ParentUniqueIdString: itm.parentUniqueIdString
                })
            });

            callApi.call($rootScope.urls.customerGroupSaveUrl, 'POST', { customerGroupData: model }, function (response) {
                $rootScope.showSuccess('', 'اطلاعات ثبت گردید');
            });

            //customerGroupData GroupName ParentUniqueIdString UniqueIdString


        }
    }
})();