var panel = {
    init: function () {
        this.userPagIng();
    },
    userPagIng: function (curr) {//分页
        $.ajax({
            type: "post",
            url: urlScope + "/user/findToHouTai",
            dataType: "json",
            data: {
                page: curr || 1,
                rows: 10
            },
            success: function (data) {
                var pages = panel.packQueryData(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel.userPagIng(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    /*项目-搜索search*/
    user_manager_search: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + "/user/findToHouTai",
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                userNameOrPohoe: $("#userNameOrPohoe").val(),
                banckcardStatus: $("#banckcardStatus").val(),
                idCardStatus: $("#idCardStatus").val(),
            },
            dataType: 'json',
            success: function (data) {
                var pages = panel.packQueryData(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel.user_manager_search(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*根据身份证状态选择*/
    idCardStatus: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + "/user/findToHouTai",
            data: {
                page: curr || 1,
                rows: 10,
                idCardStatus: $("#idCardStatus").val(),
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                userNameOrPohoe: $("#userNameOrPohoe").val(),
                banckcardStatus: $("#banckcardStatus").val(),

            },
            dataType: 'json',
            success: function (data) {
                var pages = panel.packQueryData(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel.idCardStatus(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*根据银行卡状态选择*/
    banckcardStatus: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + "/user/findToHouTai",
            data: {
                page: curr || 1,
                rows: 10,
                banckcardStatus: $("#banckcardStatus").val(),
                idCardStatus: $("#idCardStatus").val(),
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                userNameOrPohoe: $("#userNameOrPohoe").val(),
            },
            dataType: 'json',
            success: function (data) {
                var pages = panel.packQueryData(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel.banckcardStatus(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    ///*根据状态操作审核未审核
    user_stop_start: function (obj, id, idCardStatus) {
        layer.confirm('请详细审查信息后再确认审核是否通过', {
            btn: ['通过', '驳回'],
            title: '审核是否通过'
        }, function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/user/updateToIdCardStatus',
               data: {
                     id: id,
                     idCardStatus: 3
                 },
                dataType: 'json',
                success: function (data) {

                    if (data.result != '1') {
                        layer.msg("审核失败", {icon: 1, time: 1000});
                        return;
                    }
                    location.replace(location.href);
                        layer.msg("审核成功", {icon: 1, time: 1000});
                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                }
            })
        }, function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/user/updateToIdCardStatus',
                data: {
                     id: id,
                     idCardStatus: 4
                 },
                dataType: 'json',
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg("驳回失败", {icon: 1, time: 1000});
                        return;
                    }
                    location.replace(location.href);
                        layer.msg("驳回成功", {icon: 1, time: 1000});
                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                }
            })
        });
    },

    packQueryData: function (data) {
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }
        var w = data.object;
        var data = w.data;
        var tag = "";
        for (var i = 0; i < data.length; i++) {
            var idCardStatus = "";
            switch (data[i].idCardStatus) {
                case '1' :
                    idCardStatus = "身份未认证";
                    break;
                case '2' :
                    idCardStatus = "身份证信息已提交，待审核";
                    break;
                case '3' :
                    idCardStatus = "已实名认证";
                    break;
                default:
                    idCardStatus = "审核失败";
            };
            var banckcardStatus = "";
            switch (data[i].banckcardStatus) {
                case '1' :
                    banckcardStatus = "银行卡未认证";
                    break;
                default:
                    banckcardStatus = "银行卡已绑定";
            };
            tag += '<tr class="text-c">' +
                '<td>' + (i + 1) + '</td>' +
                // '<td>' + data[i].id + '</td>' +
                '<td>' + data[i].realName + '</td>' +
                '<td class="bigImg" data-bigImg="' + imgurl + 'users/' + data[i].idCardImg1 + '" data-num="1"><img src="' + imgurl + 'users/' + data[i].idCardImg1 + '"></td>' +
                '<td class="bigImg" data-bigImg="' + imgurl + 'users/' + data[i].idCardImg2 + '" data-num="1"><img src="' + imgurl + 'users/' + data[i].idCardImg2 + '"></td>' +
                '<td class="bigImg" data-bigImg="' + imgurl + 'users/' + data[i].idCardImg3 + '" data-num="1"><img src="' + imgurl + 'users/' + data[i].idCardImg3 + '"></td>' +
                '<td>' + data[i].idCardNumber + '</td>' +
                '<td class="td-status"><span class="  radius">' + idCardStatus + '</span></td>' +
                '<td>' + data[i].userPhone + '</td>' +
                ' <input type="hidden" value=' + data[i].idCardStatus + '> ' +
                '</td>' +
                '<td>' + common.dateFormat(data[i].registerTime.time) + '</td>' +
                '<td>' + data[i].bankcardUsename + '</td>' +
                '<td>' + data[i].bankcardNumber + '</td>' +
                '<td>' + data[i].bankAddress + '</td>' +
                '<td class="td-status"><span class="  radius">' + banckcardStatus + '</span>' +
                ' <input type="hidden" value=' + data[i].banckcardStatus + '> ' +
                '</td>' +
                '<td class="f-14 product-brand-manage">';
            if (data[i].idCardStatus == '2') {
                tag += '<a class="label label-success radius" onClick="panel.user_stop_start(this,' + data[i].id + ',' + data[i].idCardStatus + ')" href="javascript:;" title="审核" style="text-decoration:none" >审核</a>';
            }

            if (data[i].idCardStatus == '3') {
                tag += '<a class="label radius"  href="javascript:;" title="已审核" style="text-decoration:none" >已审核</a>';
            }

            if (data[i].idCardStatus == '4') {
                tag += '<a class="label radius"  href="javascript:;" title="已驳回" style="text-decoration:none" >已驳回</a>';
            }

            if (data[i].idCardStatus == '1') {
                tag += '<a class="label radius"  href="javascript:;" title="身份未认证" style="text-decoration:none" >身份未认证</a>';
            }
            tag += '</td>' +
                '</tr>';
        }
        $("tbody").html(tag);
        $(".r > strong").html(w.totalNumber);
        if(w.totalNumber==0){
            $("#pageDiv").hide();
        }else {
            $("#pageDiv").show();
        }
        //分页部分代码
        var pages = Math.ceil(w.totalNumber / w.pageSize);
        return pages;
    },

}
$(function () {
    panel.init();

    $(document).on("click", ".bigImg", function () {
        if ($(this).attr("data-num") == "1") {
            $("#bigImg").css({
                "display": "block",
                "background": "url(" + $(this).attr("data-bigImg") + ") no-repeat",
                "background-size": "100% 100%"
            });
            $(this).attr("data-num", "2");
            $("#zhezhao").show();
        }

    });
    $("#bigImg").click(function () {
        $(this).hide();
        $(".bigImg").attr("data-num", "1");
        $("#zhezhao").hide();
    });
    $("#zhezhao").click(function () {
        $(this).hide();
        $(".bigImg").attr("data-num", "1");
        $("#bigImg").hide();
    });

});
