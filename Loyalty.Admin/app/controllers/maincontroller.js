(function () {
    'use strict';

    angular
        .module('membersApp')
        .controller('maincontroller', maincontroller);

    maincontroller.$inject = ['$rootScope', '$scope', '$http', '$location', 'callApi', 'authenticationService'];

    function maincontroller($rootScope, $scope, $http, $location, callApi, authenticationService) {

        $scope.user = $rootScope.currentUser;

        $scope.title = 'maincontroller';
        $scope.dateNow = new Date().getFullYear();

        $scope.showlogin = function () {
            return $rootScope.token() == "";
        }

        $scope.logout = function () {
            authenticationService.clearCredentials();

            $('.pages-lnk').remove();

            $location.path("/");
        }

        $scope.refreshMenu = function () {

            if ($rootScope.token() !== '')
                $rootScope.refreshMenu();
        }

        //$scope.menus = {
        //    "current": "index",
        //    "left": [{
        //        "active": true,
        //        "link": "\/",
        //        "text": "Home"
        //    },
        //    {
        //        "active": false,
        //        "link": "\/awards",
        //        "text": "Awards"
        //    },
        //    {
        //        "active": false,
        //        "link": "\/players",
        //        "text": "Players"
        //    },
        //    {
        //        "active": false,
        //        "link": "\/episodes",
        //        "text": "Episodes"
        //    },
        //    {
        //        "active": false,
        //        "link": "\/about",
        //        "text": "About"
        //    },
        //    {
        //        "active": false,
        //        "link": "\/contact",
        //        "text": "Contact Us"
        //    }],
        //    "rightLink": "\/session\/index",
        //    "rightText": "Log In"
        //};
    }
})();
