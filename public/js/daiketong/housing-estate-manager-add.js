var panel = {
    init: function() {
        common.bind_Sanji();
        $('#housing_add').unbind('click').bind('click', this.housingEstateAdd);
        $('#propertyId').unbind('click').bind('input propertychange', this.wuye);
        $('#propertyId').unbind('click').bind('focus', this.wuye);
        $('#sellersId').unbind('click').bind('input propertychange', this.xiaoshoufang);
        $('#sellersId').unbind('click').bind('focus', this.xiaoshoufang);
        $("#imgUrl").change(function() {common.fileType(imgUrl);});
    },

    housingEstateAdd: function() {
        if(!$("#imgUrl").val() || !$("#name").val() || !$("#sheng").val() || !$("#shi").val()
            || !$("#qu").val() || !$("#address").val() || !$("#houseTypeRange").val()
            || !$("#houseProportionRange").val() || !$("#devloper").val() || !$("#sellersId").val()
            || !$("#propertyId").val() || !$("#sellingPoint").val() || !$("#periPhery").val() || !$("#details").val()){  // || $("#coordinate").val()=="" || $("#coordinate2").val()==""
            layer.msg('请填写完整后提交!', { icon: 1, time: 1000 });
            return;
        }
        $("#coordinate3").val($("#coordinate").val()+","+$("#coordinate2").val());
        var form = new FormData(document.getElementById("form-add"));
        $.ajax({
            type: 'post',
            url: urlScope + "/Community/addCommunity",
            data: form,
            dataType:'json',

            processData: false,
            contentType: false,
            xhrFields:{withCredentials:true},
            beforeSend:function(){
                common.disabledButton("#housing_add");
            },
            success: function (data) {
                // var data = JSON.parse(data);
                if (data.result != '1') {
                    layer.msg('小区添加失败!', { icon: 1, time: 1000 });
                    return;
                } else {
                    layer.msg('小区添加成功!', { icon: 1, time: 1000 });
                }
                window.parent.location.reload();
            },
            error: function(XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误!', { icon: 1, time: 1000 });
            }
        });
    },


    wuye: function () {
        $(".propertyList").css("display", "block");
        $.ajax({
            type: "post",
            url: urlScope + "/Property/findPropertyByStatus",
            data: {
                likeName: $("#propertyId").val(),
            },
            dataType:'json',
            success: function (data) {
                // var data = JSON.parse(data);
                var data = data.object;
                var tag="";
                for (var i = 0; i < data.length; i++) {
                    tag+="<li value=" + data[i].propertyId + ">" + data[i].propertyName +"</li>";
                }
                $(".propertyList").html(tag);
                $(".propertyList>li").attr("onclick", "panel.onblurfuc(this)");
            }
        });
    },
    onblurfuc:function (e) {
        $("#propertyId").val(e.textContent);
        $("#propertyVal").val(e.value);
        $(".propertyList").hide();
    },

    xiaoshoufang: function () {
        $(".sellersList").css("display", "block");
        $.ajax({
            type: "post",
            url: urlScope + "/sellersCompany/getLikeCompanyName",
            data: {
                likeName: $('#sellersId').val(),
            },
            success: function (data) {
                var data = JSON.parse(data); //把json字符串转换为json对象
                var data = data.object;
                var tag="";
                for (var i = 0; i < data.length; i++) {   //companyType=="1"
                    if(data[i].companyType=="1"){
                        tag+="<li value=" + data[i].sellersCompanyId + ">" + data[i].companyName +"（内部）</li>";
                    }else {
                        tag+="<li value=" + data[i].sellersCompanyId + ">" + data[i].companyName +"</li>";
                    }
                }
                $(".sellersList").html(tag);
                $(".sellersList>li").attr("onclick", "panel.onblurfucn(this)");
            }
        })
    },
    onblurfucn:function (e) {
        $("#sellersId").val(e.textContent);
        $("#sellersVal").val(e.value);
        $(".sellersList").hide();
    },

}

$(function() {
    panel.init();
});
