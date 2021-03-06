var fal = false;
var panel = {
    init: function () {
        $('#sellersUserPhone').unbind('blur').bind('blur', this.phoneInputCheck);
        $('#sellersUserPassword').unbind('blur').bind('blur', this.Password);
        $('#communityhouse-list-add').unbind('click').bind('click', this.communityhouseListAdd);
    },

    phoneInputCheck: function (e) {
        var regMobile = /^(13[0-9]|14[57]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
        if (regMobile.test(this.value)) {
            $("#sellersUserPhone").nextAll().remove();
            fal = true;
        } else {
            $("#sellersUserPhone").nextAll().remove();
            $("#sellersUserPhone").after('<span  style="color: red;display: inline-block;font-size: 12px;">手机号码错误!</span>');
            fal = false;
            return false;
        }
    },

    Password: function () {
        var regPassword = /^[0-9_a-zA-Z]{6,20}$/;
        if (regPassword.test(this.value)) {
            $("#sellersUserPassword").nextAll().remove();
            fal = true;
        } else {
            $("#sellersUserPassword").nextAll().remove();
            $("#sellersUserPassword").after('<span  style="color: red;display: inline-block;font-size: 12px;">请输入数字、字母、下划线，6-20位组成的密码!</span>');
            fal = false;
        }
    },

    communityhouseListAdd: function () {
        var form = new FormData(document.getElementById("form-add"));
        if (!$("#companyName").val() || !$("#companyAddress").val() || !$("#sellersUserName").val() || !$("#sellersUserPhone").val() || !$("#sellersUserPassword").val()) {
            layer.msg('请填写完整后提交!', {icon: 1, time: 1000});
            return;
        }
        if (fal == true) {
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: urlScope + "/sellersCompany/addCompany",
                data: form,
                processData: false,
                contentType: false,
                xhrFields: {withCredentials: true},
                beforeSend: function () {
                    common.disabledButton("#communityhouse-list-add");
                },
                success: function (data) {

                    if (data.result == '0') {
                        layer.msg('项目添加失败!', {icon: 1, time: 1000});
                        return;
                    } else if(data.result == '1'){
                        layer.msg('项目添加成功!', {icon: 1, time: 1000});
                        setTimeout(function () {
                            window.parent.location.reload();
                        }, 1000);
                    }else {
                        layer.msg('添加失败，销售公司已经存在,请重新添加!', {icon: 1, time: 1000});
                    }
                },
                error: function (XmlHttpRequest, textStatus, errorThrown) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                }
            });

        }

    },

}

$(function () {
    panel.init();
});
