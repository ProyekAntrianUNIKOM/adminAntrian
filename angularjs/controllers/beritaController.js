'use strict';

app.controller('beritaController',function($routeParams,$scope,$http,$timeout,$location,$window,$sce){


  $http.get('http://localhost/lumenapi/public/api/berita')
    .success(function (data) {
      $scope.beritadata = data.result;
  }).error(function (data) {
    console.log(data);
  });

  if($routeParams.id_detail){
    var id = $routeParams.id_detail;
    $http.get('http://localhost/lumenapi/public/api/berita/'+id)
      .success(function (data) {
        $scope.judul = data.result[0].judul;
        $scope.isi = $sce.trustAsHtml(data.result[0].isi);
        $scope.foto = data.result[0].foto;
      }).error(function (data) {
        console.log(data);
      });
  }

  if($routeParams.id){
    var id = $routeParams.id;
    $http.get('http://localhost/lumenapi/public/api/berita/'+id)
      .success(function (data) {
        $scope.judul = data.result[0].judul;
        $scope.isi = data.result[0].isi;
        $scope.oldfile = data.result[0].foto;
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
  $scope.SendEditBerita = function(judul,isi,file,oldfile) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", file);
    fd.append("judul", judul);
    fd.append("isi", isi);
    fd.append("oldfile", oldfile);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    var id = $routeParams.id;
    $http.post('http://localhost/lumenapi/public/api/berita/'+id, fd,config).success(function(data,status){
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

  $scope.SendDataBerita = function (berita) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", berita.file);
    fd.append("judul", berita.judul);
    fd.append("isi", berita.isi);

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
