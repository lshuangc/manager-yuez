var panel = {
    init:function () {
        $('#household_add').unbind('click').bind('click', this.household_add);
    },
    household_add:function () {
        var form = new FormData(document.getElementById("form-add"));
        if(!$("#housetypeName").val()){
            layer.msg("请填写完整再提交",{ icon: 1, time: 1000 });
            return;
        }
        $.ajax({
            type:"post",
            datatype:"json" ,
            url:urlScope + "/Housetype/addHousetype",
            data:form,
            processData: false,
            contentType: false,
            xhrFields:{withCredentials:true},
            beforeSend:function () {
                // common.disabledButton("#household_add")

            },
            success:function (data) {
                var data1 = JSON.parse(data);
                if(data1.result =="0"){
                    layer.msg('添加失败!', { icon: 1, time: 1000 });
                }else if(data1.result =="1"){
                    layer.msg('添加成功!', { icon: 1, time: 1000 });
                    setTimeout(function () {
                        window.parent.location.reload();
                    }, 1000 );
                }else {
                    layer.msg('添加失败，户型已经存在，请重新添加!', { icon: 1, time: 1500 });
                }
            },
            error:function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误', { icon: 1, time: 1000 });
            }
        });

    }
}
$(function () {
    panel.init();
});