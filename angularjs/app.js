'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('adminApp', ['ngRoute','ngCookies','chart.js','ng-file-input','summernote']).controller("chartcont", function ($scope,$http) {

  var operator = [];
  var jumlah = [];
  $scope.tahunv = '-';
  $http.post('http://localhost/lumenapi/public/api/historyall')
    .success(function (data, status, headers, config) {
      for (var i=0; i<data.result.length; i++) {
        operator.push(data.result[i].nama_operator);
      }
      for (var i=0; i<data.result.length; i++) {
        jumlah.push(data.result[i].jumlah);
      }
    }).error(function (data, status, header, config) {
      console.log(data);
  });
  $scope.labels = operator;
  $scope.series = ['Antrian Terlayani'];

  $scope.data = [jumlah];

  $scope.SendData = function () {
    $scope.tahunv = $scope.tahun;
    var data = $.param({
      tahun: $scope.tahun
    });

    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }
    var operator = [];
    var jumlah = [];
    $http.post('http://localhost/lumenapi/public/api/historyall', data, config)
      .success(function (data, status, headers, config) {
        for (var i=0; i<data.result.length; i++) {
          operator.push(data.result[i].nama_operator);
        }
        for (var i=0; i<data.result.length; i++) {
          jumlah.push(data.result[i].jumlah);
        }
      }).error(function (data, status, header, config) {
        console.log(data);
    });
    $scope.labels = operator;
    $scope.series = ['Antrian Terlayani'];

    $scope.data = [jumlah];
  }

}).controller("nav", function ($scope,sessionService,$http) {
  $scope.username = sessionService.get('username');
  $http.get('http://localhost/lumenapi/public/api/operator')
    .success(function (data) {
      $scope.operatordata = data.result;
  }).error(function (data) {
    console.log(data);
  });
}).controller("head",function($scope,$http){
  $http.get('http://localhost/lumenapi/public/api/loket').success(function(data){
    $scope.loketdata = data.result;
  }).error(function(data){
    console.error(data);
  })
});

var host = "http://"+window.location.host;
var base_url  = host+"/lumenapi/public/api/";
app.value('base_url',base_url);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {templateUrl: './views/home.html',controller:'homeController'});
  $routeProvider.when('/login', {templateUrl: './views/login.html',controller:'loginController'});
  $routeProvider.when('/operator', {templateUrl: './views/operator.html',controller:'operatorController'});
  $routeProvider.when('/operator/detail/:id', {templateUrl: './views/historyoperator.html',controller:'operatorController'});
  $routeProvider.when('/berita', {templateUrl: './views/berita.html',controller:'beritaController'});
  $routeProvider.when('/berita/add', {templateUrl: './views/formberita.html',controller:'beritaController'});
  $routeProvider.when('/berita/edit/:id', {templateUrl: './views/editberita.html',controller:'beritaController'});
  $routeProvider.when('/berita/detail/:id_detail', {templateUrl: './views/detailberita.html',controller:'beritaController'});
  $routeProvider.when('/berita/:idhapus', {controller:'beritaController'});

}]);

app.run(function($rootScope,$location,loginService){
  var routespermission=['/','/operator','/operator/detail/:id','/berita/edit/:id','/berita','/berita/add','/berita/detail/:id_detail'];
  $rootScope.$on('$routeChangeStart',function(){
    if(routespermission.indexOf($location.path()) !=-1 && !loginService.isLogged()){
      $location.path('/login');
    }
  });
});
