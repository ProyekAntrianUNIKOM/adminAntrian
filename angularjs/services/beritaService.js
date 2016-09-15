'use strict';
app.factory('beritaService',function($http,$location,$q,sessionService,base_url,$timeout){
    return{
        simpan:function (berita,scope) {
           var $promise=$http.post(base_url+'berita',berita); //send data
            $promise
                .success(function(data,status){
                    if(data.status==200){
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
                })
                .error(function (data) {
                    console.error(data);
                });
        }
    }
});
