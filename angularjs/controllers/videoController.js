'use strict';
//let's make a startFrom filter
app.filter('startFrom', function() {
  return function(input, start) {
    if (!input || !input.length) { return; }
      start = +start; //parse to int
      return input.slice(start);
  }
});

app.controller('videoController',function($routeParams,$scope,$http,$timeout,$location,$window,$sce){

  $http.get('http://localhost/lumenapi/public/api/video')
    .success(function (data) {
      //pagination
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.videodata = data.result;
      $scope.numberOfPages=function(){
        return Math.ceil($scope.videodata.length/$scope.pageSize);
      }
      var now = new Date().toISOString().slice(0,10);
      $scope.tglnow = now;
  }).error(function (data) {
    console.log(data);
  });


  //detail video
  if($routeParams.id_detailVideo){
    var id = $routeParams.id_detailVideo;
    $http.get('http://localhost/lumenapi/public/api/video/'+id)
      .success(function (data) {
        $scope.getIframeSrc = function (video) {
          return 'http://localhost/lumenapi/public/video/' + video;
        };
        $scope.poster = function (video) {
          return 'http://localhost/lumenapi/public/img/' + video;
        };
        $scope.judul = data.result[0].judul;
        $scope.video = data.result[0].video;
      }).error(function (data) {
        console.log(data);
      });
  }

  //edit video
  if($routeParams.id_editVideo){
    var id = $routeParams.id_editVideo;
    $http.get('http://localhost/lumenapi/public/api/video/'+id)
      .success(function (data) {
        $scope.judul = data.result[0].judul;
        $scope.oldfile = data.result[0].video;
      }).error(function (data) {
        console.log(data);
      });
  }

  $scope.deleteData = function(id){
    $http.delete('http://localhost/lumenapi/public/api/video/'+id)
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

  $scope.SendEditVideo = function(judul,file,oldfile) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", file);
    fd.append("judul", judul);
    fd.append("oldfile", oldfile);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    var id = $routeParams.id_editVideo;
    $http.post('http://localhost/lumenapi/public/api/video/'+id, fd,config).success(function(data,status){
      if(data.status==200) {
        document.getElementById('error').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        $scope.status = 'refresh';
        $scope.msgTextsuccess="Sedang mengubah data ...";
        $timeout(function(){
          $scope.status = 'ok';
          $scope.msgTextsuccess="Data Berhasil Diubah.";
          $timeout(function(){
            $location.path("/video");
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

  $scope.SendDataVideo = function (video) {
    var fd = new FormData();
    //Take the first selected file
    fd.append("file", video.file);
    fd.append("judul", video.judul);

    var config = {
      headers : {
        'Content-Type': undefined
      }
    }
    $http.post('http://localhost/lumenapi/public/api/video', fd,config).success(function(data,status){
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
