'use strict';

app.controller('beritaController',function($routeParams,$scope,$http,$timeout,$location,$window){
  $http.get('http://localhost/lumenapi/public/api/berita')
    .success(function (data) {
      $scope.beritadata = data.result;
  }).error(function (data) {
    console.log(data);
  });

  if($routeParams.id){
    var id = $routeParams.id;
    $http.get('http://localhost/lumenapi/public/api/berita/'+id)
      .success(function (data) {
        $scope.judul = data.result[0].judul;
        $scope.isi = data.result[0].isi;
      }).error(function (data) {
        console.log(data);
      });
  }
  $scope.deleteData = function(id){
    console.log(id);
    $http.delete('http://localhost/lumenapi/public/api/berita/'+id)
      .success(function (data) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.msgTextsuccess="Sedang menghapus data ...";
        $timeout(function(){
          $scope.msgTextsuccess="Data Berhasil Dihapus.";
        },2000);
        $timeout(function () {
          $window.location.reload();
        }, 3000);
      }).error(function (data) {
        console.log(data);
      });
  }

  $scope.uploadFile = function(files) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", files[0]);
    console.error(fd);
    $http.post('http://localhost/lumenapi/public/api/berita', fd, {
        withCredentials: true,
        headers: {'Content-Type': undefined },
        transformRequest: angular.identity
    }).success(function(data){
      console.error(data);
    }).error(function(data){
        console.error(data);
    });

  };
  $scope.SendEditBerita = function(judul,isi) {
    var data = {
      judul : judul,
      isi : isi
    }
    var config = {
      headers : {
        'Content-Type': 'application/json'
      }
    }
    var id = $routeParams.id;
    $http.put('http://localhost/lumenapi/public/api/berita/'+id, data,config).success(function(data,status){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.msgTextsuccess="Sedang mengubah data ...";
        $timeout(function(){
          $scope.msgTextsuccess="Data Berhasil Diubah.";
        },2000);
      }else{
        document.getElementById('error').style.display = 'block';
        $scope.msgTexterror=data;
      }
    }).error(function(data){
      console.error(data);
    });
  }

  $scope.SendDataBerita = function (berita,file) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", berita.file);
    fd.append("judul", berita.judul);
    fd.append("isi", berita.isi);
    console.log(fd);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    $http.post('http://localhost/lumenapi/public/api/berita', fd,config).success(function(data,status){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.msgTextsuccess="Sedang mengirim data ...";
        $timeout(function(){
          $scope.msgTextsuccess="Data Berhasil Disimpan.";
        },2000);
      }else{
        document.getElementById('error').style.display = 'block';
        $scope.msgTexterror=data;
      }
    }).error(function(data){
      console.error(data);
    });
  }
});
