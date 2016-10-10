'use strict';

app.controller('mahasiswaController',function($scope,sessionService,$http){

  $http.get('http://localhost/lumenapi/public/api/mahasiswa')
    .success(function (data) {
      $scope.mhsdata = data.result;
      console.log(data);
  }).error(function (data) {
    console.log(data);
  });

});
