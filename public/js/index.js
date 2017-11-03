var panel = {
    init: function () {
        common.isLogin("");

        this.recommen();
        this.userTips();
        this.sellerTips();
        this.communityhouseTips();

        setInterval(function () {
            panel.recommen();
            panel.userTips();
            panel.sellerTips();
            panel.communityhouseTips();
        }, 10000);
    },

    recommen: function () {
        $.ajax({
            type: "post",
            url: urlScope + "/message/houtaigetRecommendMessageNum",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('操作数据失败', {icon: 1, time: 1000});
                    return;
                }
                if(data.object=="0"){
                    $(".recommenTips").hide();
                }else {
                    $(".recommenTips").show();
                    // var tag = data.object;
                    // $(".recommenTips").html(tag).css("background","red");
                    $(".recommenTips").html(data.object).css("background","red");
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    userTips:function () {
        $.ajax({
            type: "post",
            url: urlScope + "/message/houtaigetUserMessageNum",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('操作数据失败', {icon: 1, time: 1000});
                    return;
                }
                if(data.object==0){
                    $(".userTips").hide();
                }else {
                    $(".userTips").show();
                    var tag = data.object;
                    $(".userTips").html(tag).css("background","red");
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    sellerTips:function () {
        $.ajax({
            type: "post",
            url: urlScope + "/message/houtaigetSellersCompanyMessageNum",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('操作数据失败', {icon: 1, time: 1000});
                    return;
                }
                if(data.object==0){
                    $(".sellerTips").hide();
                }else {
                    $(".sellerTips").show();
                    var tag = data.object;
                    $(".sellerTips").html(tag).css("background","red");
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    communityhouseTips:function () {
        $.ajax({
            type: "post",
            url: urlScope + "/message/houtaigetcommunityDetailMessageNum",
            dataType: "json",
            data: {},
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('操作数据失败', {icon: 1, time: 1000});
                    return;
                }
                if(data.object==0){
                    $(".communityhouseTips").hide();
                }else {
                    $(".communityhouseTips").show();
                    var tag = data.object;
                    $(".communityhouseTips").html(tag).css("background","red");
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    quit: function () {
        layer.confirm('确认要退出登录吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/admin/logout',
                data: {},
                dataType: 'json',
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg('退出登录失败', {icon: 1, time: 1000});
                        return;
                    }
                    layer.msg('已退出登录!', {icon: 1, time: 1000});
                    top.location = "login.html";
                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                },
            });
        });
    },

    change: function () {
        layer.confirm('确认要切换账户吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/admin/logout',
                data: {},
                dataType: 'json',
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg('切换账户失败', {icon: 1, time: 1000});
                        return;
                    }
                    layer.msg('已切换账户!', {icon: 1, time: 1000});
                    top.location = "login.html";
                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                },
            });
        });
    },

};

$(function () {
    panel.init();
    $('#menu li').click(function () {
        $("li").addClass('classGrey').not($(this)).removeClass('classGrey');    //获取除当前Li的所有其他li元素
    });
});