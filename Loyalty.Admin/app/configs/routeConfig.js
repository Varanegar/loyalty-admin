
angular.module('membersApp')
       .config(function ($routeProvider) {

           $routeProvider
           .when("/login", {
               templateUrl: "partials/login.htm",
               controller: "logincontroller"
           })
           .when("/restorePassword/:uid", {
               templateUrl: "partials/restorePassword.htm",
               controller: "restorePasswordcontroller"
           })
           .when("/signup", {
               templateUrl: "partials/signup.htm",
               controller: "signupcontroller"
           })
            .when("/userManager", {
                templateUrl: "partials/userManager/users.htm",
                controller: "userscontroller",
                authorize: true,
            })
           .when("/userManager/edit/:uid?", { 
               templateUrl: "partials/userManager/editUser.htm",
               controller: "usereditcontroller",
               authorize: true,
           })
            .when("/userManager/permissions/", {
                templateUrl: "partials/userManager/permissions.htm",
                controller: "permissionscontroller",
                authorize: true,
            })
           .when("/editCustomer", {
               templateUrl: "partials/customer/editCustomer.html",
               controller: "customercontroller",
           })
           .when("/customers", {
               templateUrl: "partials/customer/customers.html",
               controller: "customercontroller",
           })
           .when("/editCard", {
               templateUrl: "partials/card/editCard.html",
               controller: "cardController",
           })
           .when("/cards", {
               templateUrl: "partials/card/cards.html",
               controller: "cardController",
           })
           .otherwise({
               redirectTo: "/",
           })
       });