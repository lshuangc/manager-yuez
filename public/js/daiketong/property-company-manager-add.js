'use strict';
var panel = {
    init: function() {
        $('#property-add').unbind('click').bind('click', this.propertyAdd);
    },

    propertyAdd: function() {
        var form = new FormData(document.getElementById("form-add"));
        if(!$("#propertyName").val()){//选择器
            layer.msg('请填写完整后提交!', { icon: 1, time: 1000 });
            return;
        }
        $.ajax({
            type: 'post',
            url: urlScope + "/Property/addProperty",//地址
            data: form,
            dataType:'json',
            processData: false,
            contentType: false,
            xhrFields:{withCredentials:true},
            beforeSend:function(){
                // common.disabledButton("#property-add");
            },
            success: function (data) {
                if (data.result == '0') {
                    layer.msg('物业公司添加失败!', { icon: 1, time: 1000 });
                } else if(data.result == '1'){
                    layer.msg('物业公司添加成功!', { icon: 1, time: 1000 });
                    setTimeout(function () {
                        window.parent.location.reload();
                    },1000)
                }else {
                    layer.msg('物业公司已存在，请重新添加!', { icon: 1, time: 1000 });
                }
            },
            error: function(XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误!', { icon: 1, time: 1000 });
            }
        });
    }




}

$(function() {
    panel.init();
});