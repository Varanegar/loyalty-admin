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
           //.when("/signup", {
           //    templateUrl: "partials/signup.htm",
           //    controller: "signupcontroller"
           //})
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
               authorize: true,
           })
           .when("/customer/edit/:uid?", {
               templateUrl: "partials/customer/editCustomer.html",
               controller: "editCustomerController",
               authorize: true,
           })
           .when("/customer/addQuick", {
               templateUrl: "partials/customer/editCustomerQuick.html",
               controller: "editCustomerQuickController",
               authorize: true,
           })
           .when("/card/edit/:uid?", {
               templateUrl: "partials/card/editCard.html",
               controller: "editCardController",
               authorize: true,
           })
           .when("/card/:uid", {
               templateUrl: "partials/card/cards.html",
               controller: "cardController",
               authorize: true,
           })
           .when("/cardGroup/", {
               templateUrl: "partials/card/cardGroup.html",
               controller: "cardGroupController",
               authorize: true,
           })
           .when("/cardGroup/edit/:uid?", {
               templateUrl: "partials/card/editCardGroup.html",
               controller: "editCardGroupController",
               authorize: true,
           })
           .when("/customer/groups", {
               templateUrl: "partials/customer/group.htm",
               controller: "customergroupcontroller",
               authorize: true,
           })
           .when('/tiers/list', {
               templateUrl: "partials/customer/customerTiers.html",
               controller: "customerTierController",
               authorize: true,
           })
           .when('/tiers/edit/:uid?', {
               templateUrl: "partials/customer/editCustomerTier.html",
               controller: "editCustomerTierController",
               authorize: true,
           })
           .when("/test", {
               templateUrl: "partials/test.htm",
               controller: "testcontroller",
               authorize: true,
           })
           .when("/profile", {
               templateUrl: "partials/profile.htm",
               controller: "profilecontroller",
               authorize: true,
           })
           .when("/groups", {
               templateUrl: "partials/groupManager/groups.htm",
               controller: "groupscontroller",
               authorize: true,
           })
           .when("/groupUsers/:gname/:gid", {
               templateUrl: "partials/groupManager/users.htm",
               controller: "groupUserscontroller",
               authorize: true,
           })
           .when("/groupPermissions/:gname/:gid", {
               templateUrl: "partials/groupManager/permissions.htm",
               controller: "groupPermissionsController",
               authorize: true,
           })
           .otherwise({
               redirectTo: "/",
           })
       });