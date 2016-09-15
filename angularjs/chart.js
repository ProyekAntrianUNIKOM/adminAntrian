'use strict';

angular.module("adminApp", ["chart.js"]).controller("chartcont", function ($scope,$http) {

  $scope.SendData = function () {
    var data = $.param({
      id_operator: $scope.id_operator
    });


  var config = {
    headers : {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  var tahun = [];
  var jumlah = [];
  $http.post('http://localhost/lumenapi/public/api/history', data, config)
    .success(function (data, status, headers, config) {
    $scope.operator = data.nama_operator;
    $scope.loket = data.nama_loket;
    for (var i=0; i<data.result.length; i++) {
      tahun.push(data.result[i].tahun);
    }
    for (var i=0; i<data.result.length; i++) {
      jumlah.push(data.result[i].jumlah);
    }
  }).error(function (data, status, header, config) {
    console.log(data);
  });
  $scope.labels = tahun;
  $scope.series = ['Series A', 'Series B'];

  $scope.data = jumlah;
}
});
