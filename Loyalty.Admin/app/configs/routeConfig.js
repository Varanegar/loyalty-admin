
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
                templateUrl: "partials/users.htm",
                controller: "userscontroller",
                authorize: true,
            })
           .when("/userManager/edit/:uid", {
               templateUrl: "partials/editUser.htm",
               controller: "userscontroller",
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