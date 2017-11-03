'use strict';

var panel = {
    init: function () {
        this.recommend_manager_describe();
    },
    recommend_manager_describe: function () {
        $.ajax({
            type:"post",
            url:urlScope + "/recommendRecord/findById",
            dataType:"json",
            data: {
                recordId: common.getQueryString("id")
            },
            success:function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var data = data.object;
                var  tag = "";
                for(var i = 0;i < data.length;i ++){
                    var recommendFlow = "";
                    switch (data[i].recommendFlow) {
                        // 查基本小区
                        case "1" :
                            recommendFlow="已推荐";
                            break;
                        case "2" :
                            recommendFlow="推荐单已审核";
                            break;
                        case "3" :
                            recommendFlow="推荐单已确认";
                            break;
                        case "4" :
                            recommendFlow="上门已确认";
                            break;
                        case "5" :
                            recommendFlow="待客确认单已提交";
                            break;
                        case "6" :
                            recommendFlow="待客确认单已审核";
                            break;
                        case "7" :
                            recommendFlow="签约单已提交";
                            break;
                        case "8" :
                            recommendFlow="签约单已审核";
                            break;
                        case "9" :
                            recommendFlow="签约单已确认";
                            break;
                        case "905" :
                            recommendFlow="运营复核";
                            break;
                        default:
                            recommendFlow="佣金已发放";
                    };
                    var recommendStatus="";
                    switch (data[i].recommendStatus) {
                        // 查基本小区
                        case "1" :
                            recommendStatus="正常";
                            break;
                        case "2" :
                            recommendStatus="取消";
                            break;
                        case "3" :
                            recommendStatus="签约";
                            break;
                        default:
                            recommendStatus="完成";
                    };
                    var recommendRewardType = data[i].recommendRewardType == "1" ? '小区' : '二手房';
                    var recommendProjectType = data[i].recommendProjectType == '1' ? '新房' : '二手';
                    var recommendGettype = data[i].recommendGettype == '1' ? '半款（立即申请）,50%' : '全款（等待回款）, 100%';
                    tag +=
                    '<div class="row cl">'+
                    '    <span class=" col-xs-6 col-sm-6">销售员姓名：'+data[i].sellersUserName+'</span>'+
                    '<span class="col-xs-6 col-sm-6">推荐单生成日期：'+ common.dateFormat(data[i].recommendAddTime.time)+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                    '    <span class=" col-xs-6 col-sm-6">销售员电话：'+data[i].sellersUserPhone+'</span>'+
                    '<span class="col-xs-6 col-sm-6">流程编号推荐单流程：'+recommendFlow+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                    '<span class="col-xs-6 col-sm-6">推荐单类型：'+recommendProjectType+'</span>'+
                        '<span class="col-xs-6 col-sm-6">推荐单消息提示：'+data[i].approveMessage+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                    '    <span class=" col-xs-6 col-sm-6">带客人姓名：'+data[i].realUserName+'</span>'+
                        '<span class="col-xs-6 col-sm-6">推荐项目类型：'+recommendRewardType+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                    '    <span class=" col-xs-6 col-sm-6">带客人电话：'+data[i].realUserPhone+'</span>'+
                    '<span class="col-xs-6 col-sm-6">推荐单状态：'+recommendStatus+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                        // '<span class="col-xs-6 col-sm-6">上门到访时间：'+common.dateFormat(data[i].recommendVisitTime.time)+'</span>'+
                    '<span class="col-xs-6 col-sm-6">推荐小区地址：'+data[i].recommendProjectAddress+'</span>'+
                        '<span class="col-xs-6 col-sm-6">推荐项目名称：'+data[i].recommendProjectName+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                    '    <span class=" col-xs-6 col-sm-6">推荐人姓名：'+data[i].userName+'</span>'+
                        '<span class="col-xs-6 col-sm-6">佣金领取类型：'+recommendGettype+'</span>'+
                    '</div>'+

                    '<div class="row cl">'+
                    '    <span class=" col-xs-6 col-sm-6">推荐人电话：'+data[i].userPhone+'</span>'+
                        '<span class=" col-xs-6 col-sm-6">应付推荐佣金：'+data[i].makeMoney+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+
                    '   <span class=" col-xs-6 col-sm-6">被推荐人姓名：'+data[i].recommendUserName+'</span>'+
                        '<span class=" col-xs-6 col-sm-6">实付推荐佣金：'+data[i].recommendSendmoney+'</span>'+
                    '</div>'+
                        '<div class="row cl">'+
                        '    <span class=" col-xs-6 col-sm-6">被推荐人电话：'+data[i].recommendUserPhone+'</span>'+
                        '   <span class=" col-xs-6 col-sm-6">最终购房成交金额：'+data[i].contractMoney+'万</span>'+
                        '</div>'+
                    '<div class="row cl">'+
                        '<span class="col-xs-6 col-sm-6">推荐单备注：'+data[i].recommendDescr+'</span>'+
                    '</div>'+
                    '<div class="row cl">'+  //
                    '    <span class="col-xs-4 col-sm-4 bigImg" data-bigImg="' + imgurl + 'recommend/' + data[i].approveBill + '" data-num="1">购房发票：<img src="' + imgurl + 'recommend/' + data[i].approveBill + '")" alt="图片待上传"></span>'+
                        '<span class="col-xs-4 col-sm-4 bigImg" data-bigImg="' + imgurl + 'recommend/' + data[i].approveBuyhouse + '" data-num="1">购房合同页图片：<img src="' + imgurl + 'recommend/' + data[i].approveBuyhouse + '")"  alt="图片待上传"></span>'+
                        '<span class="col-xs-4 col-sm-4 bigImg" data-bigImg="' + imgurl + 'recommend/' + data[i].approveReceive + '" data-num="1">待客现场确认图片：<img src="' + imgurl + 'recommend/' + data[i].approveReceive + '")" alt="图片待上传"> </span>'+
                    '</div>';
                }
                $("form").html(tag);
            },
            error:function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
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
        } else {
            $("#bigImg").hide();
            $(".bigImg").attr("data-num", "1");
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
