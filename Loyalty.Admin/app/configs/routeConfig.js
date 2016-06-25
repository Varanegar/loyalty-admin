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
           .when("/userManager/permissions", {
                templateUrl: "partials/userManager/permissions.htm",
                controller: "permissionscontroller",
                authorize: true,
            })
           .when("/customer/list", {
                templateUrl: "partials/customer/customers.html",
               controller: "customercontroller",
           })
           .when("/customer/edit/:uid?", {
               templateUrl: "partials/customer/editCustomer.html",
               controller: "editCustomerController",
           })
           .when("/customer/addQuick", {
               templateUrl: "partials/customer/editCustomerQuick.html",
               controller: "editCustomerQuickController",
           })
           .when("/card/edit/:uid?", {
               templateUrl: "partials/card/editCard.html",
               controller: "editCardController",
           })
           .when("/card/:uid", {
               templateUrl: "partials/card/cards.html",
               controller: "cardController",
           })
            .when("/cardGroup/", {
                templateUrl: "partials/card/cardGroup.html",
                controller: "cardGroupController",
            })
            .when("/cardGroup/edit/:uid?", {
                templateUrl: "partials/card/editCardGroup.html",
                controller: "editCardGroupController",
            })
           .when("/customer/groups", {
               templateUrl: "partials/customer/group.htm",
               controller: "customergroupcontroller",
               authorize: true,
           })
           .otherwise({
               redirectTo: "/",

           })
       });