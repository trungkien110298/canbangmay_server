$(document).ready(function () {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: "toast-top-right",
        preventDuplicates: false,
        onclick: null,
        showDuration: "1000",
        hideDuration: "1000",
        timeOut: "3000",
        extendedTimeOut: "5000",
        showEasing: "swing",
        hideEasing: "linear",
        showMethod: "fadeIn",
        hideMethod: "fadeOut",
    };
    Cookies.remove('token');
    $("#login").click(function () {
        Cookies.remove('token');
        let username = $("#username").val();
        let password = $("#password").val();
        let req = { username: username, password: password };
        $.ajax({
            url: "/api-login",
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(req),
            dataType: "json",
            success: function (data) {
                if (data.message == "OK") {
                    toastr.success("Đăng nhập thành công", "Success!");
                    Cookies.set('token', data.data[0].token)
                    $.ajaxSetup({
                        headers: {
                            'Authorization': Cookies.get('token')
                        }
                    })
                    $.ajax({
                        url: "/home",
                        // contentType: "application/json",
                        method: "GET",
                        // dataType: "json",
                        // 
                        success: function (data) {
                            var newDoc = document.open("text/html", "replace");
                            newDoc.write(data);
                            newDoc.close();
                            // window.location.href = "/home";
                        }
                    })
                    //window.location.href = "/home";
                } else {
                    toastr.error("Tài khoản hoặc mật khẩu không đúng", "Error!");
                }
            },
        });
    })
});