'use strict';

app.controller('operatorController',function($routeParams,$scope,$http){
  $http.get('http://localhost/lumenapi/public/api/operator')
    .success(function (data) {
      $scope.operatordata = data.result;
  }).error(function (data) {
    console.log(data);
  });

  var data = {
    id_operator : $routeParams.id,
    tahun : '2016'
  }

  var config = {
    headers : {
      'Content-Type': 'application/json'
    }
  }

  $http.post('http://localhost/lumenapi/public/api/historydetail',data,config)
  .success(function(data){
    $scope.datahistory = data.result;
    $scope.nama_operator = data.nama_operator;
    $scope.nama_loket = data.nama_loket;
  }).error(function(data){
    console.log(data);
  });
});
