'use strict';
var panel = {
    init: function () {
        $('#communityhouse-list-add').unbind('click').bind('click', this.communityhouseListAdd);
        $('#communityhouse-second-add').unbind('click').bind('click', this.community_house_Add);

        $('#communityId').unbind('click').bind('input propertychange', this.changeComn);
        $('#communityId').unbind('click').bind('focus', this.changeComn);
        $('#subwayId').unbind('click').bind('input propertychange', this.subway);
        $('#subwayId').unbind('click').bind('focus', this.subway);//subwayList

    },

    //新房提交
    communityhouseListAdd: function () {
        var form = new FormData(document.getElementById("form-add"));

        if ($("#communityId").val() == "" || $("#latestSaleTime").val() == "" || $("#firstHandTime").val() == "" || $("#averagePrice").val() == "" || $("#houseSp").val() == "" || $("#subwayId").val() == "") {
            layer.msg('请填写完整后提交!', {icon: 1, time: 1000});
            return;
        }
        $.ajax({
            type: 'post',
            url: urlScope + "/CommunityDetail/addCommunityDetail",
            data: form,
            dataType:'json',
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                // common.disabledButton("#communityhouse-list-add");
            },
            success: function (data) {
                if (data.result == '0') {
                    layer.msg('添加小区失败!', {icon: 1, time: 1000});
                    return;
                } else if(data.result == '1'){
                    layer.msg('添加小区成功!', {icon: 1, time: 1000});
                    setTimeout(function () {
                        window.parent.location.reload();
                    }, 1000 );
                    // window.parent.location.reload();
                }else {
                    layer.msg('小区信息已经存在，请勿重复添加!', { icon: 1, time: 1500 });
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            }
        });
    },

    //二手房提交
    community_house_Add: function () {
        var form = new FormData(document.getElementById("form"));
        if ($("#housePhoto").val() == "" || $("#houseName").val() == "" || $("#communityId").val() == "" || $("#communityHousetypeId").val() == "" || $("#houseProportion").val() == "" || $("#floorNum").val() == "" || $("#houseCode").val() == "" || $("#houseUnitPrice").val() == "" || $("#housePercentage").val() == "" || $("#houseLabel").val() == "") {
            layer.msg('请填写完整后提交!', {icon: 1, time: 1000});
            return;
        }
        $.ajax({
            type: 'post',
            url: urlScope + "/house/addHouse",
            data: form,
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                // common.disabledButton("#communityhouse-second-add");
            },
            success: function (data) {
                var data = JSON.parse(data);
                if (data.result != '1') {
                    layer.msg('添加二手房小区失败!', {icon: 1, time: 1000});
                    return;
                } else {
                    layer.msg('添加二手房小区成功!', {icon: 1, time: 1000});
                    // window.parent.location.reload();
                }
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            }
        });
        window.parent.location.reload();
    },

    //标签
    subway: function () {
        $(".subwayList").css("display", "block");
        $.ajax({
            type: "post",
            url: urlScope + "/Label/findAll",
            data: {},
            dataType:'json',
            success: function (data) {
                var data = data.object;
                var tag = "";
                var arr = [];
                for (var i = 0; i < data.length; i++) {
                    tag += "<li>" + data[i].labelName + "</li>";
                };
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
            // dataType:'json',
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
