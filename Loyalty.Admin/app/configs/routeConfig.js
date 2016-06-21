
angular.module('membersApp')
       .config(function ($routeProvider) {
           debugger
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
           .otherwise({
               redirectTo: "/",
           })
       });