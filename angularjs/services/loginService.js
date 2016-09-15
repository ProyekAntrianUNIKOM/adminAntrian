'use strict';
app.factory('loginService',function($http,$location,$q,sessionService,base_url,$timeout){
    return{
        login:function (admin,scope) {
           var $promise=$http.post(base_url+'authadmin',admin); //send data
            $promise
                .success(function(data,status){
                    if(data.status==200){
                        sessionService.set('id_admin',data.result[0].id_admin);
                        sessionService.set('username',data.result[0].username);
                        document.getElementById('error').style.display = 'none';
                        document.getElementById('success').style.display = 'block';
                        scope.msgTextsuccess="Berhasil Login , beberapa saat lagi anda akan di redirect ke halaman admin...";
                        $timeout(function(){
                          $location.path("/");
                        },2000);
                    }else{
                        document.getElementById('error').style.display = 'block';
                        scope.msgTexterror="Maaf, username atau password yang anda masukan salah.";
                        $location.path('/login');
                    }
                })
                .error(function (data,status) {
                    document.write(data);
                });
        },
        logout:function () {
            sessionService.destroy('id_admin');
            sessionService.destroy('username');
            $location.path('/login');
        },
        isLogged:function () {
            if(sessionService.get('id_admin')) return true;
        }
    }
});
