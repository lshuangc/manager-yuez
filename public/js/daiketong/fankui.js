var panel = {
    init: function () {
        this.fankuiPagIng();
    },

    fankuiPagIng: function (curr) {
        $.ajax({
            type: "post",
            url: urlScope + "/feedback/getFeedBack",
            dataType: "json",
            data: {
                page: curr || 1,
                rows: 4,
                feedBackType:0
            },
            success: function (data) {
                var pages = panel.packQueryData(data);
                laypage({
                    cont: $('#pageDiv'),
                    pages: pages,
                    skip: true,
                    skin: '#5a98de',
                    groups: 5,
                    curr: curr || 1,
                    jump: function (obj, first) {
                        if (!first) {
                            panel.fankuiPagIng(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
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
            tag += '<div class="describe ">' +
                '            <p>反馈描述*</p>' +
                '            <div class="describeLi">' +
                '                <div class="describeneirong ">&nbsp;&nbsp;&nbsp;&nbsp;'+data[i].feedBackDescribe+'</div>' +
                '                <div class="describeImg">' +
                '<img  class="bigImg"  data-num="1" style=" margin-left: 45px;height: 60px;margin-top: 10px;margin-bottom: 10px" src="' + imgurl + 'feedback/' + data[i].feedBackImg + '">' +
                '                </div>' ;
                // '                <a class="button">待处理</a>' +
            if (data[i].feedBackType == '0') {
                // tag += '<a class="label label-success radius" onClick="panel.user_stop_start(this,' + data[i].id + ',' + data[i].idCardStatus + ')" href="javascript:;" title="审核" style="text-decoration:none" >审核</a>';
                tag +='                <a class="button"  onclick="panel.feedBackTypeOr(this,' + data[i].feedBackId + ',' + data[i].feedBackType + ')">处理</a>' ;
            }

            else {
                $(".button").hide();
            }


            tag +='            </div>' +
                '        </div>';
        }
        $(".feedbackDescribe").html(tag);
        $(".r > strong").html(w.totalNumber);
        //分页部分代码
        var pages = Math.ceil(w.totalNumber / w.pageSize);
        return pages;
    },

    feedBackType:function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/feedback/getFeedBack',
            data: {
                page: curr || 1,
                rows: 4,
                feedBackType:1
            },
            dataType: 'json',
            success: function (data) {
                var pages = panel.packQueryData(data);
                laypage({
                    cont: $('#pageDiv'),
                    pages: pages,
                    skip: true,
                    skin: '#5a98de',
                    groups: 5,
                    curr: curr || 1,
                    jump: function (obj, first) {
                        if (!first) {
                            panel.feedBackType(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    feedBackTypeOr:function (obj, feedBackId, feedBackType) {
        layer.confirm('是否要处理此消息', {
            // btn: ['通过', '驳回'],
            // title: '审核是否通过'
        }, function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/feedback/updateFeedBack',
                data: {
                    feedBackId: feedBackId,
                    feedBackType: 1
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
        })
    }

}

$(function () {
    panel.init();
    $("#feedback > .feedbackDiv > a").click(function () {
        $(this).addClass('btn-primary').siblings().removeClass('btn-primary');
    });


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
