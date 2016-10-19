'use strict';
//let's make a startFrom filter
app.filter('startFrom', function() {
  return function(input, start) {
    if (!input || !input.length) { return; }
      start = +start; //parse to int
      return input.slice(start);
  }
});

app.controller('beritaController',function($routeParams,$scope,$http,$timeout,$location,$window,$sce){

  $http.get('http://localhost/lumenapi/public/api/berita')
    .success(function (data) {
      //pagination
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.beritadata = data.result;
      $scope.numberOfPages=function(){
        return Math.ceil($scope.beritadata.length/$scope.pageSize);
      }
      var now = new Date().toISOString().slice(0,10);
      $scope.tglnow = now;
  }).error(function (data) {
    console.log(data);
  });

  $scope.allberita = function() {
    $http.get('http://localhost/lumenapi/public/api/berita')
      .success(function (data) {
        var now = new Date().toISOString().slice(0,10);
        $scope.beritadata = data.result;
        $scope.tglnow = now;
    }).error(function (data) {
      console.log(data);
    });
  }

  $scope.activeberita = function() {
    $http.get('http://localhost/lumenapi/public/api/berita/active')
      .success(function (data) {
        $scope.beritadata = data.result;
        $scope.passive = "display:none";
        $scope.active = "display:block";
    }).error(function (data) {
      console.log(data);
    });
  }

  $scope.passiveberita = function() {
    $http.get('http://localhost/lumenapi/public/api/berita/passive')
      .success(function (data) {
        $scope.beritadata = data.result;
        $scope.active = "display:none";
        $scope.passive = "display:block";
    }).error(function (data) {
      console.log(data);
    });
  }


  //detail berita
  if($routeParams.id_detailBerita){
    var id = $routeParams.id_detailBerita;
    $http.get('http://localhost/lumenapi/public/api/berita/'+id)
      .success(function (data) {
        $scope.judul = data.result[0].judul;
        $scope.isi = $sce.trustAsHtml(data.result[0].isi);
        $scope.foto = data.result[0].foto;
        $scope.tgl_expire = data.result[0].tgl_expire;
        $scope.tgl_posting = data.result[0].tgl_posting;
      }).error(function (data) {
        console.log(data);
      });
  }

  //edit berita
  if($routeParams.id_editBerita){
    var id = $routeParams.id_editBerita;
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
        $scope.status = 'refresh';
        $scope.msgTextsuccess="Sedang menghapus data ...";
        $timeout(function(){
          $scope.status = 'ok';
          $scope.msgTextsuccess="Data Berhasil Dihapus.";
        },2000);
        $timeout(function () {
          $window.location.reload();
        }, 3000);
      }).error(function (data) {
        console.log(data);
      });
  }

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
    var id = $routeParams.id_editBerita;
    $http.post('http://localhost/lumenapi/public/api/berita/'+id, fd,config).success(function(data,status){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.status = 'refresh';
        $scope.msgTextsuccess="Sedang mengubah data ...";
        $timeout(function(){
          $scope.status = 'ok';
          $scope.msgTextsuccess="Data Berhasil Diubah.";
          $timeout(function(){
            $location.path("/berita");
          },800);
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
    fd.append("tgl_expire", berita.tgl_expire);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    $http.post('http://localhost/lumenapi/public/api/berita', fd,config).success(function(data,status){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.status = 'refresh';
        $scope.msgTextsuccess="Sedang mengirim data ...";
        $timeout(function(){
          $scope.status = 'ok';
          $scope.msgTextsuccess="Data Berhasil Disimpan.";
        },2000);
      }else{
        document.getElementById('error').style.display = 'block';
        $scope.msgTexterror=data.message;
      }
    }).error(function(data){
      console.error(data);
    });
  }
});
