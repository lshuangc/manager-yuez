'use strict';
var panel = {
    init: function () {
        this.sellerPagIng();
    },

    sellerPagIng: function (curr) { //分页
        $.ajax({
            type: 'POST',
            url: urlScope + '/sellersCompany/getAllByConditions',
            dataType: 'json',
            data: {
                page: curr || 1,
                pageSize: 10
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
                            panel.sellerPagIng(obj.curr);
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
    seller_search: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/sellersCompany/getAllByConditions',
            data: {
                page: curr || 1,
                pageSize: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                companyName: $("#sellerName").val(),
                companyStatus: $("#proState").val()
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
                            panel.seller_search(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    //添加项目弹出框
    seller_add: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

//审核是否通过
    shenhe: function (obj, companyStatus,sellersCompanyId, sellersUserId) {
        switch (companyStatus) {
            case 0:
                layer.confirm('请确认是否通过', {
                    btn: ['通过', '驳回'], //按钮
                    title: '销售商审核'
                }, function () {
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/sellersCompany/updateStatus',
                        data: {
                            status: 1,
                            sellersUserId: sellersUserId,
                            sellersCompanyId: sellersCompanyId,
                            sellersUserDescribe:'审核成功'
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.result != '1') {
                                layer.msg("审核失败", {icon: 1, time: 1000});
                                return;
                            }
                            location.replace(location.href);
                            layer.msg("审核成功", {icon: 1, time: 1000});


                            // panel.sellerTips();

                        },
                        error: function (data) {
                            layer.msg('网络错误!', {icon: 1, time: 1000});
                        }
                    })
                }, function () {
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/sellersCompany/updateStatus',
                        data: {
                            status: 2,
                            sellersUserId: sellersUserId,
                            sellersCompanyId: sellersCompanyId,
                            sellersUserDescribe:'您的申请无效，请重新提交'
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.result != '1') {
                                layer.msg("驳回失败", {icon: 1, time: 1000});
                                return;
                            }
                            layer.msg("驳回成功", {icon: 1, time: 1000});
                            location.replace(location.href);
                        },
                        error: function (data) {
                            layer.msg('网络错误!', {icon: 1, time: 1000});
                        }
                    })
                });
                break;
        }
    },

    leixing: function (obj, companyType,sellersCompanyId) {
        companyType = companyType == '1' ? '2' : '1';
        layer.confirm(companyType == '1' ? '确定要修改成内部公司吗？' : '确定要修改为外部公司吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/sellersCompany/updateCompanytype',
                data: {
                    sellersCompanyId: sellersCompanyId,
                    companyType: companyType
                },
                dataType: 'json',
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg(companyType == '1' ? '修改成内部公司失败' : '修改成内部公司失败', {icon: 1, time: 1000});
                        return;
                    }
                    setTimeout(function () {
                        layer.msg(companyType == '1' ? '修改为外部公司成功' : '修改为外部公司成功', {icon: 1, time: 1000});
                    });
                    setTimeout(function () {
                        location.replace(location.href);
                    },2000);

                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                },
            });
        });
    },

    /*根据状态选择*/
    proState: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/sellersCompany/getAllByConditions',
            data: {
                page: curr || 1,
                pageSize: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                companyName: $("#sellerName").val(),
                companyStatus: $("#proState").val(),
                companyType:$("#companyType").val()

            },
            dataType: 'json',
            success: function (data) {
                // panel.packQueryData(data, curr);    //
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
                            panel.proState(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    packQueryData: function (data) {
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }
        var w = data.object;
        var data = w.data;
        var tag = '';
        for (var i = 0; i < data.length; i++) {
            var sellersUser = data[i].sellersUsers;
            var companyStatus = "";
            switch (data[i].companyStatus) {
                case "0" :
                    companyStatus = "待审核";
                    break;
                case "1" :
                    companyStatus = "启用";
                    break;
                case "2" :
                    companyStatus = "驳回";
                    break;
            };

            var companyType = "";
            switch (data[i].companyType) {
                case "1" :
                    companyType = "内部公司";
                    break;
                case "2" :
                    companyType = "外部公司";
                    break;
            };
            tag += '<tr class="text-c">' +
                '<td>' + (i + 1) + '</td>' +
                // '<td class="bigImg" data-bigImg="' + imgurl + 'users/' + data[i].idCardImg1 + '" data-num="1"><img src="' + imgurl + 'users/' + data[i].idCardImg1 + '"></td>' +
                '<td class="bigImg" data-bigImg="' + imgurl + 'merchantsFigure/' + data[i].sellersUserImg + '" data-num="1"><img src="' + imgurl + 'merchantsFigure/' + data[i].sellersUserImg + '" ></td>' +
                '<td>' + data[i].companyName + '</td>' +
                '<td >' + data[i].companyAddress + '</td>' +
                '<td >' + data[i].sellersUserLicenseId + '</td>' +
                '<td >' + data[i].sellersUserLegalperson + '</td>' +
                '<td>';
            for (var j = 0; j < sellersUser.length; j++) {
                var sellersUserType = sellersUser[j].sellersUserType;
                var sellersUserId = sellersUser[j].sellersUserId;
                if (sellersUserType == '1') {
                    tag += '' + sellersUser[j].sellersUserName + ' , ' + sellersUser[j].sellersUserPhone + '<br>';
                }
            }
            tag += '</td>' +
                '<td >' + data[i].sellersUserDescribe + '</td>' +
                '<td>' + common.dateFormat(data[i].addTime.time) + '</td>' +
                '<td class="td-status"><span class=" ">' + companyStatus + '</span>' +
                '<input type=hidden  value=' + data[i].companyStatus + '>' +
                '</td>' +
                '<td class="f-14 product-brand-manage">' ;
            if(data[i].companyStatus=='0'){
                tag +='<a class="label label-success radius" onClick="panel.shenhe(this,' + data[i].companyStatus + ',' + data[i].sellersCompanyId + ',' + sellersUserId + ')" href="javascript:;" title="" style="text-decoration:none" >审核</a>' ;
            }
            if(data[i].companyStatus=='1'){
                tag +='<a class="label href="javascript:;" title="" style="text-decoration:none" >审核通过</a>' ;
            }if(data[i].companyStatus=='2'){
                tag +='<a class="label radius"  href="javascript:;" title="" style="text-decoration:none" >已驳回</a>';
            }
            tag +='</td>' +
                '<td class="td-status"><span class=" ">' + companyType + '</span>' +
                '<input type=hidden  value=' + data[i].companyType + '>' +
                '</td>' +
                '<td class="f-14 product-brand-manage">' +
            '<a class="label label-success radius" onClick="panel.leixing(this,' + data[i].companyType + ',' + data[i].sellersCompanyId + ')" href="javascript:;" title="" style="text-decoration:none" >修改类型</a>' +
            '</td>' +    
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
        // else {
        //     $("#bigImg").hide();
        //     $(".bigImg").attr("data-num", "1");
        //     $("#zhezhao").hide();
        // }
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
