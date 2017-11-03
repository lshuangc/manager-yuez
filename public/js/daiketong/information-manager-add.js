var panel = {
    init:function () {
        $('#information_manager_add').unbind('click').bind('click', this.information_manager_add);
    },

    information_manager_add:function () {
        var form = new FormData(document.getElementById("form-add"));
        if($("#informationPhoto").val() == "" || $("#informationTitle").val() == "" || $("#informationTxt").val() == ""){
            layer.msg("请填写完整再提交",{ icon: 1, time: 1000 });
            return;
        }
        $.ajax({
            type:"post",
            datatype:"json" ,
            url:urlScope + "/information/addInformation",
            data:form,
            processData: false,
            contentType: false,
            xhrFields:{withCredentials:true},
            beforeSend:function () {
                common.disabledButton("#information_manager_add")
            },
            success:function (data) {
                var data1 = JSON.parse(data);
                console.log(data1[0]);

                if(data1.result =="0"){
                    layer.msg('资讯添加失败!', { icon: 1, time: 1000 });
                }else if(data1.result =="1"){
                    layer.msg('资讯添加成功!', { icon: 1, time: 1000 });
                    setTimeout(function () {
                        window.parent.location.reload();
                    },1000);
                };
            },
            error:function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误', { icon: 1, time: 1000 });
            }
        });

    }
}
$(function () {
    panel.init();
})