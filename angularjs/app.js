'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('adminApp', ['ngRoute','ngCookies','chart.js','ng-file-input','summernote','ngAnimate']).controller("chartcont", function ($scope,$http) {

  var operator = [];
  var jumlah = [];
  $scope.tahunv = '-';
  $scope.bulanv = '-';
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
    $scope.bulanv = $scope.bulan;
    var data = $.param({
      tahun: $scope.tahun,
      bulan: $scope.bulan
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

}).controller("nav", function ($scope,sessionService,$http,$location) {
  $scope.logout = function() {
    sessionService.destroy('id_admin');
    sessionService.destroy('username');
    $location.path('/login');
  }
  $scope.username = sessionService.get('username');
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
  //operator
  $routeProvider.when('/operator', {templateUrl: './views/operator/operator.html',controller:'operatorController'});
  $routeProvider.when('/operator/detail/:id', {templateUrl: './views/operator/historyoperator.html',controller:'operatorController'});
  //berita
  $routeProvider.when('/berita', {templateUrl: './views/berita/berita.html',controller:'beritaController'});
  $routeProvider.when('/berita/add', {templateUrl: './views/berita/formberita.html',controller:'beritaController'});
  $routeProvider.when('/berita/edit/:id_editBerita', {templateUrl: './views/berita/editberita.html',controller:'beritaController'});
  $routeProvider.when('/berita/detail/:id_detailBerita', {templateUrl: './views/berita/detailberita.html',controller:'beritaController'});
  $routeProvider.when('/berita/:idhapus', {controller:'beritaController'});
  //video
  $routeProvider.when('/video', {templateUrl: './views/video/video.html',controller:'videoController'});
  $routeProvider.when('/video/add', {templateUrl: './views/video/formvideo.html',controller:'videoController'});
  $routeProvider.when('/video/edit/:id_editVideo', {templateUrl: './views/video/editvideo.html',controller:'videoController'});
  $routeProvider.when('/video/detail/:id_detailVideo', {templateUrl: './views/video/detailvideo.html',controller:'videoController'});
  $routeProvider.when('/video/:idhapus', {controller:'videoController'});
  //mahasiswa
  $routeProvider.when('/mahasiswa', {templateUrl: './views/mahasiswa/mahasiswa.html',controller:'mahasiswaController'});
  $routeProvider.when('/mahasiswa/daftar', {templateUrl: './views/mahasiswa/formmahasiswa.html',controller:'mahasiswaController'});
  //banner
  $routeProvider.when('/banner', {templateUrl: './views/banner/banner.html',controller:'bannerController'});
  $routeProvider.when('/banner/add', {templateUrl: './views/banner/formbanner.html',controller:'bannerController'});
  $routeProvider.when('/banner/edit/:id_editBanner', {templateUrl: './views/banner/editbanner.html',controller:'bannerController'});
}]);

app.run(function($rootScope,$location,loginService){
  var routespermission=['/','/operator','/operator/detail/:id','/berita/edit/:id',
                        '/berita','/berita/add','/berita/detail/:id_detailBerita','/mahasiswa',
                        '/banner','/banner/add','/banner/edit/:id_banner','/video','/video/add',
                        '/video/edit/:id_editVideo','/video/detail/:id_detailVideo','/video/:idhapus'];
  $rootScope.$on('$routeChangeStart',function(){
    if(routespermission.indexOf($location.path()) !=-1 && !loginService.isLogged()){
      $location.path('/login');
    }
  });
});
