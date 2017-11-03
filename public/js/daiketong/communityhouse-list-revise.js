var panel = {
    init: function () {
        $('#communityId').unbind('click').bind('input propertychange', this.changeComn);
        $('#communityId').unbind('click').bind('focus', this.changeComn);
        $('#subwayId').unbind('click').bind('input propertychange', this.subway);
        $('#subwayId').unbind('click').bind('focus', this.subway);
        $('#propertyId').unbind('click').bind('input propertychange', this.wuye);
        $('#propertyId').unbind('click').bind('focus', this.wuye);
        $('#sellersId').unbind('click').bind('input propertychange', this.xiaoshoufang);
        $('#sellersId').unbind('click').bind('focus', this.xiaoshoufang);
        $("#imgUrl").change(function () {
            common.fileType(imgUrl);
        });
        this.communityhouse_revise_describe();
        $("#id").val(common.getQueryString("revisid"));
        $('#revis_add').unbind('click').bind('click', this.communityhouse_reviseAdd);
    },

    communityhouse_revise_describe: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/CommunityDetail/findById',
            dataType: 'json',
            data: {
                id: common.getQueryString("revisid"),
            },
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var data = data.object;
                $("#communityId").val(data.name);
                $("#communityVal").val(data.communityId);
                $("#latestSaleTime").val(common.dateFormat(data.latestSaleTime.time));
                $("#firstHandTime").val(common.dateFormat(data.firstHandTime.time));
                $("#averagePrice").val(data.averagePrice);
                $("#houseSp").val(data.houseSp);
                $("#subwayId").val(data.communityLabel);
                // $("#subwayVal").val(data.communityId);
                // $("#recommendPercentage").val(data.recommendPercentage);
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    communityhouse_reviseAdd: function () {
    if ($("#communityId").val() == "" ||$("#latestSaleTime").val() == "" || $("#firstHandTime").val() == "" || $("#averagePrice").val() == ""
        || $("#houseSp").val() == "" || $("#subwayId").val() == "" || $("#recommendPercentage").val() == "") {
            layer.msg('请填写完整后提交!', {icon: 1, time: 1000});
            return;
        }
        var form = new FormData(document.getElementById("form"));
        $.ajax({
            type: 'post',
            url: urlScope + "/CommunityDetail/updateCommunityDetail",
            data: form,
            dataType: 'json',
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                // common.disabledButton("#revise_add");
            },
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('修改失败!', {icon: 1, time: 1000});
                    return;
                } else {
                    layer.msg('修改成功!', {icon: 1, time: 1000});
                    setTimeout(function () {
                        window.parent.location.reload();
                    },2000)
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            }
        });
    },

    subway: function () {
        $(".subwayList").css("display", "block");
        $.ajax({
            type: "post",
            url: urlScope + "/Label/findAll",
            data: {},
            success: function (data) {
                var data = JSON.parse(data);
                var data = data.object;
                var tag = "";
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    tag += "<li>" + data[i].labelName + "</li>";
                }
                ;
                arr.push(tag);
                $(".subwayList").html(arr);
                $(".subwayList>li").attr("onclick", "panel.onblurfu(this)");
            }
        })
    },
    onblurfu: function (e) {
        if ($("#subwayVal").val() == '') {
            $("#subwayId").val(e.textContent);
            $("#subwayVal").val(e.textContent);
        } else {
            if ($("#subwayVal").val().indexOf(e.textContent + "") < 0) {
                $("#subwayId").val($("#subwayId").val() + "," + e.textContent);
                $("#subwayVal").val($("#subwayVal").val() + "," + e.textContent);
            }
            $(".subwayList").hide();
        }
    },

    changeComn: function () {
        $(".communityList").css("display", "block");
        $.ajax({
            type: "post",
            url: urlScope + "/Community/findByScreen",
            data: {
                name: $('#communityId').val(),
                page: 1,
                rows: 99999999
            },
            success: function (data) {
                var result = JSON.parse(data); //把json字符串转换为json对象
                var data1 = result.object.data;
                var tag = "";
                for (var i = 0; i < data1.length; i++) {
                    tag += "<li value=" + data1[i].id + ">" + data1[i].name + "</li>";
                }
                $(".communityList").html(tag);
                $(".communityList>li").attr("onclick", "panel.onblurfucn(this)");
            }
        });
    },
    onblurfucn: function (e) {
        $("#communityId").val(e.textContent);
        $("#communityVal").val(e.value);
        $(".communityList").hide();
        var communityId = e.value;
        $.ajax({
            type: "post",
            url: urlScope + "/CommunityHousetype/getHouseTypesByCommunityId",
            data: {
                communityId: communityId
            },
            success: function (data) {
                var result = JSON.parse(data);
                var data1 = result.object;
                if (data1) {
                    var htmls = "";
                    $("#communityHousetypeId").empty();
                    for (var i = 0; i < data1.length; i++) {
                        htmls += "<option value=" + data1[i].id + ">" + data1[i].housetypeName + "</option>";
                    }
                    $("#communityHousetypeId").append(htmls);
                } else {
                    alert("请先给小区添加户型！");
                }
            }
        });
    },

}

$(function () {
    panel.init();

});