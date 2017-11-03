var panel = {
    init: function() {
        $("#reviseid").val(common.getQueryString("reviseid"));
        // $('#propertyId').unbind('click').bind('input propertychange', this.wuye);
        // $('#propertyId').unbind('click').bind('focus', this.wuye);
        $('#sellersId').unbind('click').bind('input propertychange', this.xiaoshoufang);
        $('#sellersId').unbind('click').bind('focus', this.xiaoshoufang);
        $("#imgUrl").change(function() {common.fileType(imgUrl);});
        $('#revise_add').unbind('click').bind('click', this.reviseAdd);
        this.revise_describe();
    },


    revise_describe: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Community/getCommunitiesById',
            dataType: 'json',
            data: {
                id:common.getQueryString("reviseid")
            },
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var data = data.object;
                for (var i = 0; i < data.length; i++) {  //localStorage.getItem
                    $("#fengmian").attr("src",imgurl+"community/"+data[i].imgUrl);
                    $('input[name="imgUrl"]').attr("src",imgurl+"community/"+data[i].imgUrl);
                    // // $(".idcardimg1").attr(imgurl+"community/"+data[i].imgUrl);
                    // // $('input[name="imgUrl"]').attr(imgurl+"community/"+data[i].imgUrl);
                    // $('.idcardimg1 .onclick1 input[name="imgUrl"] ').attr(imgurl+"community/"+data[i].imgUrl);

                    var sheng = document.getElementById("sheng");
                    sheng.options[0] = new Option(data[i].provinceName, data[i].provinceCode);
                    var shi = document.getElementById("shi");
                    shi.options[0] = new Option(data[i].cityName, data[i].cityCode);
                    var qu = document.getElementById("qu");
                    qu.options[0] = new Option(data[i].countyName, data[i].countyCode);
                    $("#name").val(data[i].name);
                    $("#address").val(data[i].address);
                    // $("#coordinate").val((data[i].coordinate).split(',')[0]);
                    // $("#coordinate2").val((data[i].coordinate).split(',')[1]);
                    // $("#coordinate3").val(data[i].coordinate);
                    $("#houseTypeRange").val(data[i].houseTypeRange);
                    $("#houseProportionRange").val(data[i].houseProportionRange);
                    $("#propertyId").val(data[i].propertyName);
                    $("#propertyVal").val(data[i].propertyId);
                    $("#devloper").val(data[i].devloper);
                    $("#sellersId").val(data[i].sellerCommpanyName);
                    $("#sellersVal").val(data[i].sellersCompanyId);
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    reviseAdd: function() {
        if($("#name").val()=="" || $("#sheng").val() == ""|| $("#shi").val() == "" || $("#qu").val() == "" || $("#address").val()=="" || $("#houseTypeRange").val()=="" || $("#houseProportionRange").val()=="" || $("#propertyId").val()=="" || $("#devloper").val()=="" || $("#sellersId").val()==""){ // || $("#coordinate").val()=="" || $("#coordinate2").val()==""
            layer.msg('请填写完整后提交!', { icon: 1, time: 1000 });
            return;
        }
        $("#coordinate3").val($("#coordinate").val()+","+$("#coordinate2").val());
        var form = new FormData(document.getElementById("form-revise"));
        $.ajax({
            type: 'post',
            url: urlScope + "/Community/updateCommuity",
            data: form,
            dataType:'json',
            processData: false,
            contentType: false,
            xhrFields:{withCredentials:true},
            beforeSend:function(){
                // common.disabledButton("#revise_add");
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
                for (var i = 0; i < data.length; i++) {
                    tag+="<li value=" + data[i].sellersCompanyId + ">" + data[i].companyName +"</li>";
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