var panel = {
    init: function () {
        $('#login').unbind('click').bind('click', this.login);
    },
    login: function () {
        if (!$("#phoneInput").val() || !$("#passwordInput").val()) {
            layer.msg("用户名和密码不能为空", {icon: 1, time: 1000});
            return;
        }
        $.ajax({
            url: urlScope + "/admin/login",
            type: 'post',
            dataType: 'json',
            data: {
                adminName: $("#phoneInput").val(),
                password: $("#passwordInput").val()
            },
            xhrFields: {withCredentials: true},
            success: function (data) {
                if (data.result != "1") {
                    layer.msg("登陆失败，用户名或密码不正确", {icon: 1, time: 1000});
                    return;
                } else {
                    layer.msg("登陆成功", {icon: 1, time: 1000});

                    localStorage.setItem("login-userPhone", $("#phoneInput").val());
                    if ($("#online").attr("data-type") == "1") {
                        localStorage.setItem("login-userPassWord", $("#passwordInput").val());
                    } else {
                        localStorage.setItem("login-userPassWord", "");
                    }
                    setTimeout(function () {
                        window.location.href = "./index.html";
                    }, 1000);
                }
            },
            error: function () {
                layer.msg("网络错误", {icon: 1, time: 1000});
            },
        });
    },

};

$(function () {
    panel.init();

    //获取并验证记住的账号密码
    $("#phoneInput").val(localStorage.getItem("login-userPhone"));
    $("#passwordInput").val(localStorage.getItem("login-userPassWord"));

    if ($("#passwordInput").val()) {
        $("#online").attr("data-type", "1");
        $("#online").prop("checked", "checked");
    } else {
        $("#online").attr("data-type", "2");
        $("#online").prop("checked", "");
    }

    // 是否记住密码
    $("#online").click(function () {
        if ($(this).attr("data-type") == "2") {
            $(this).attr("data-type", "1");
        } else if ($(this).attr("data-type") == "1") {
            $(this).attr("data-type", "2");
        }
    });


});