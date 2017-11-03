var panel = {
    init: function () {
        // $('#admin-password-save').unbind('click').bind('click', this.passwordCheck());
        // common.disabledButton("#retrieve");

    },
    passwordCheck: function () {
        if (!$("#newpassword").val() || !$("#newpassword2").val()) {
            layer.msg('请填写完整后提交!', {icon: 1, time: 1000});
            return;
        }
        $.ajax({
            url: urlScope + "/admin/updateAdminPassword",
            type: 'post',
            dataType:'json',
            data: {
                id: common.getQueryString("id") ,
                password: $("#newpassword").val()
            },
            xhrFields:{withCredentials:true},
            success: function (data) {
                if (data.result == "1") {
                    layer.msg('修改密码成功!', { icon: 1, time: 1000 });
                    setTimeout(function () {
                        window.parent.location.reload();
                    }, 1000);
                } else {
                    layer.msg('修改密码失败!', { icon: 1, time: 1000 });
                    return;
                }

            },
            error: function () {
                layer.msg('网络错误!', { icon: 1, time: 1000 });
            },
        });
    },

};

$(function () {
    panel.init();
});