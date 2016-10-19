'use strict';

app.controller('bannerController',function($scope,sessionService,$http,$timeout,$routeParams,$sce){

  $http.get('http://localhost/lumenapi/public/api/banner')
    .success(function (data) {
      //pagination
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.bannerdata = data.result;
      $scope.numberOfPages=function(){
        return Math.ceil($scope.bannerdata.length/$scope.pageSize);
      }
  }).error(function (data) {
    console.log(data);
  });

  $scope.SendDatabanner = function(banner) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", banner.file);
    fd.append("judul", banner.judul);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    $http.post('http://localhost/lumenapi/public/api/banner', fd,config).success(function(data,status){
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
        $scope.msgTexterror = '';
        for (var i = 0; i < data.messages.file.length; i++) {
          $scope.msgTexterror+=data.messages.file[i]+' ';
        }
      }
    }).error(function(data){
      console.error(data);
    });
  }

  //edit banner
  if($routeParams.id_editBanner){
    var id = $routeParams.id_editBanner;
    $http.get('http://localhost/lumenapi/public/api/banner/'+id)
      .success(function (data) {
        $scope.judul = data.result[0].judul;
        $scope.oldfile = data.result[0].banner_img;
      }).error(function (data) {
        console.log(data);
      });
  }
  $scope.SendEditBanner = function(judul,file,oldfile) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("judul", judul);
    fd.append("file", file);
    fd.append("oldfile", oldfile);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    var id = $routeParams.id_editBanner;
    $http.post('http://localhost/lumenapi/public/api/banner/'+id, fd,config).success(function(data,status){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.status = 'refresh';
        $scope.msgTextsuccess="Sedang mengubah data ...";
        $timeout(function(){
          $scope.status = 'ok';
          $scope.msgTextsuccess="Data Berhasil Diubah.";
          $timeout(function(){
            $location.path("/banner");
          },800);
        },2000);
      }else{
        document.getElementById('error').style.display = 'block';
        $scope.msgTexterror = '';
        for (var i = 0; i < data.messages.file.length; i++) {
          $scope.msgTexterror+=data.messages.file[i]+' ';
        }
      }
    }).error(function(data){
      console.error(data);
    });
  }

  $scope.deleteData = function(id){
    $http.delete('http://localhost/lumenapi/public/api/banner/'+id)
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

});
