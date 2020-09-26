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

    $("#login").click(function () {
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
                // toastr.success("Đăng nhập thành công", "Success!");
                if (data.message == "OK") {
                    localStorage.setItem('token', data.data[0].token)
                    $.ajax({
                        url: "/home",
                        // contentType: "application/json",
                        method: "GET",
                        // dataType: "json",
                        headers: { "Authorization": localStorage.getItem('token') },
                        success: function (data) {
                            var newDoc = document.open("text/html", "replace");
                            newDoc.write(data);
                            newDoc.close();
                        }
                    })
                    //window.location.href = "/home";
                }
            },
        });
    })
});