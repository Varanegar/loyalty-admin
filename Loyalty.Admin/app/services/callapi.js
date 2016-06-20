
angular.module('membersApp')
       .service('$callApi', function () {

           this.call = function ($http, url, method, success, fail) {
               if ($rootScope.token == undefined || $rootScope.token === '') 
                   $location.path("/login");

               $http({
                   method: method,
                   url: url,

               }).then(success, function fail(response) {
                   //$scope.myWelcome = response.statusText;

                   return fail;

               });
           }
       });

