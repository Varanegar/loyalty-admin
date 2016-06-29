(function () {
    'use strict';
    angular
           .module('membersApp')
           .controller('regionController', regionController);

    regionController.$inject = ['$scope', '$location', '$watch', '$rootScope', 'toaster', 'callApi'];

    function regionController($scope, $location, $watch, $rootScope, toaster, callApi) {
        //TreeView
        $scope.allRegions = [];
        $scope.selectedItem = '';
        $scope.$watch('selectedItem', function () {
        });
        $scope.groupName = '';
        $scope.flgUpdate = false;
        $scope.pendingGroups = [];
        $scope.root = '';

        var trvRead = function (e) {
            var id = e.data.uniqueId || "";

            e.success($.grep($scope.allRegions, function (x) {
                return x.parentUniqueIdString == id;
            }));
        }

        $scope.treeRefresh = function () {
            callApi.call($rootScope.urls.regionByParentIdUrl, 'POST',
                    JSON.stringify({ parentRegionId: $scope.selectedItem.uniqueId }), function (response) {
                        $scope.allRegions = response.data;
                        $scope.tree.dataSource.read();
                    });
        };

        $scope.allRegionsOptions = {
            dataTextField: "groupName",
            loadOnDemand: false,
            dataSource: {
                transport: {
                    read: function (e) {
                        if ($scope.allRegions.length == 0)
                            callApi.call($rootScope.urls.regionByParentIdUrl, 'POST',
                                    JSON.stringify({ parentRegionId: $scope.selectedItem.uniqueId }), function (response) {
                                        $scope.allRegions = response.data;

                                        trvRead(e);

                                        //select the root node
                                        $scope.root = $scope.tree.findByText($scope.tree.root[0].innerText.trim());
                                        $scope.tree.select($scope.root);
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

                            for (var i = 0; i < $scope.allRegions.length; i++) {
                                if ($scope.allRegions[i].parentUniqueIdString == id) {
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
            var items = $.grep($scope.allRegions, function (x) {
                return x.groupName == $scope.groupName;
            });

            var pendingItems = $.grep($scope.pendingGroups, function (x) {
                return x.groupName == $scope.groupName;
            });

            if (items.length > 0 || pendingItems.length > 0) {
                $rootScope.showError('', 'نام وارد شده تکراری است');
                $scope.groupName = '';
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
                //remove from server!
                var removedGroup = [{
                    UniqueIdString: $scope.selectedItem.uniqueId,
                    ParentUniqueIdString: $scope.selectedItem.parentUniqueIdString,
                    GroupName: $scope.selectedItem.groupName,
                }];

                callApi.call($rootScope.urls.removeCustomerGroupUrl, 'POST', { customerGroupData: removedGroup }, function (response) {
                    $rootScope.showSuccess('', 'گروه حذف گردید');
                });
            }

            var array = item.parent();
            var index = array.indexOf(item);
            array.splice(index, 1);

            $scope.selectedItem = $scope.allRegions[0];
            //select the root node
            $scope.tree.select($scope.root);
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

        function insertGroup() {
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
                $scope.pendingGroups = [];
            });
        }
        function updateGroup() {
            var model = [{
                UniqueIdString: $scope.selectedItem.uniqueId,
                ParentUniqueIdString: $scope.selectedItem.parentUniqueIdString,
                GroupName: $scope.groupName,
            }];

            callApi.call($rootScope.urls.customerGroupSaveUrl, 'POST', { customerGroupData: model }, function (response) {
                $rootScope.showSuccess('', 'اطلاعات ذخیره گردید');
                $scope.flgUpdate = false;
                $scope.groupName = '';
                $scope.pendingGroups = [];
                $scope.tree.select($scope.root);

                $scope.treeRefresh();
            });
        }
        $scope.save = function () {
            if ($scope.flgUpdate == true)
                updateGroup();
            else
                insertGroup();
        }

        $scope.edit = function (item) {
            if (item.parentUniqueIdString == "") {
                $rootScope.showError('', 'شما مجاز به ویرایش این آیتم نمی باشید!');
                return;
            }
            $scope.flgUpdate = true;
            $scope.pendingGroups.push($scope.selectedItem);

            $scope.groupName = item.groupName;
        }
    }
})();