'use strict';

app.controller('loginController',function($q,$scope,$http,loginService){
    $scope.login = function(admin){
       loginService.login(admin,$scope); // call login service
   }
});
