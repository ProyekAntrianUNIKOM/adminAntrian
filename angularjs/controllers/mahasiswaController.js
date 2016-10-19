'use strict';
//24.10.14.1.66
app.controller('mahasiswaController',function($scope,sessionService,$http,$timeout){

  $http.get('http://localhost/lumenapi/public/api/mahasiswa')
    .success(function (data) {
      //pagination
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.mhsdata = data.result;
      $scope.numberOfPages=function(){
        return Math.ceil($scope.mhsdata.length/$scope.pageSize);
      }
  }).error(function (data) {
    console.log(data);
  });

  $scope.SendDataMahasiswa = function (mahasiswa) {
    var data = {
      no_rfid : mahasiswa.norfid,
      nim : mahasiswa.nim,
      nama : mahasiswa.nama,
      prodi : mahasiswa.prodi
    }

    var config = {
      headers : {
        'Content-Type': 'application/json'
      }
    }

    $http.post('http://localhost/lumenapi/public/api/mahasiswa',data,config)
    .success(function(data){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.status = 'refresh';
        $scope.msgTextsuccess="Sedang mengirim data ...";
        $timeout(function(){
          $scope.status = 'ok';
          $scope.msgTextsuccess="Data Berhasil Disimpan.";
          $scope.mahasiswa.norfid = '';
          $scope.mahasiswa.nim = '';
          $scope.mahasiswa.nama = '';
          $scope.mahasiswa.prodi = '';
        },2000);
      }else{
        document.getElementById('error').style.display = 'block';
        $scope.msgTexterror=data.message;
      }
    }).error(function(data){
      console.log(data);
    });
  }

});
