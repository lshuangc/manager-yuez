var panel = {
    init: function () {
        // common.bind_Sanji();
        this.recommendPagIng();
    },

    // 移除列表
    remove_List: function () {
        // $("#CommunityHouse_btn").html(' ');
        $("#tbody").html(' ');
    },

    // 选择类型change_recommendType
    change_recommendType: function (sel) {
        var typeValue = $(sel).val();
        switch (typeValue) {
            // 查基本小区
            case '1' :
                this.remove_List(); // 清空列表
                this.recommendPagIng(1); //  默认加载 “新房”第一页
                break;
            case '2' :
                this.remove_List(); // 清空列表
                this.secondHand(1); //  默认加载 “二手房”第一页
                break;
        }
    },

    // 搜索按钮
    btn_findByScreen: function () {
        var typeValue = $("select[name = communityhouse-type]").val();
        switch (typeValue) {
            case '1' :
                this.recommend_search(); // 新房
                break;
            case '2' :
                this.second_search();//二手房
                break;
        }
    },

    // 选 区域 绑定 相应的小区
    bind_communitySelect: function (data) {
        var communitySelect = $(data).val();
        $.ajax({
            type: "post",
            url: urlScope + "/Community/findByScreen",
            datatype: "json",
            data: {
                countyCode: communitySelect,
                page: 1,
                rows: 10
            },
            success: function (data) {
                var datalist = JSON.parse(data);
                var community = document.getElementById("communityId");
                community.options[0] = new Option("全部", " ");
                var communityList = datalist.object.data;
                console.log(communityList.length);
                for (var i = 0; i < communityList.length; i++) {
                    community.options[i + 1] = new Option(communityList[i].name, communityList[i].id);
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });

    },

    //新房
    recommendPagIng: function (curr) {//
        $.ajax({
            type: "post",
            url: urlScope + "/recommendRecord/houtaiByCommunity",
            dataType: "json",
            data: {
                page: curr || 1,
                rows: 10
            },
            success: function (data) {
                // data = JSON.parse(data);
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
                            panel.recommendPagIng(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    //二手房
    secondHand: function (curr) {
        $.ajax({
            type: "post",
            url: urlScope + "/recommendRecord/houtaiByHouse",   //recommendRecord/houtaiByHouse
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
                            panel.secondHand(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    // 审核 函数
    updateTo2or6: function (recordId, recommendFlow) {
        switch (recommendFlow) {
            case 1:
                layer.confirm('请到详情页面确认信息，是否通过？<br/>通过：流转甲方确认&nbsp;&nbsp;驳回：终止此单', {
                    btn: ['通过', '驳回'],
                    title: '推荐单信息审核'
                }, function () {
                    // 如果通过 修改流程recommendFlow为 2
                    layer.confirm('确定要通过审核吗？', function () {
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendFlow: '2',
                                approveMessage: '推荐单已审核完毕,等待确认！'
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        });
                    });
                }, function () {
                    layer.prompt({title: '请填写驳回的理由', formType: 2}, function (text, index) {
                        layer.close(index);
                        // 如果不通过 状态改recommendStatus为2（取消）
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendStatus: '2',
                                approveMessage: "驳回的原因：" + text, // '您的信息不通过，请您重新提交推荐单！'
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        });
                    });
                });
                break;
            case 5 :
                layer.confirm('请到详情页面确认待客单，是否通过？<br/>通过：此单进入保护期&nbsp;&nbsp;驳回：经纪人重新上传', {
                    btn: ['通过', '驳回'], //按钮
                    title: '代客确认单审核'
                }, function () {
                    // 如果通过 修改流程为 6
                    layer.confirm('确定要通过待客单吗？', function () {
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendFlow: '6',
                                approveMessage: '待客确认单已审核完毕,请在保护期内完成签约!'
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        });
                    });
                }, function () {
                    // 如果不通过 流程改为4（重新提交带客确认单）
                    // layer.confirm('确定要驳回待客单吗？', function () {
                    layer.prompt({title: '请填写驳回的理由', formType: 2}, function (text, index) {
                        layer.close(index);
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendFlow: '4',
                                approveMessage: '驳回的原因：' + text,
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        })
                    });
                });
                break;
            case 7:
                layer.confirm('请到详情页面确认签约单，是否通过？<br/>通过：流转甲方确认&nbsp;&nbsp;驳回：经纪人重新上传<br/><br/>' +
                    '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请确定是否要通过签约单？' ,
                    // '最终购房成交金额：<input id="contractMoney" type="text" style="height:22px;" /> 万<br/><br/> ' +
                    // '推荐佣金：<input id="makeMoney" type="text" style="height:22px;" /> 元 ',
                    {
                    btn: ['通过', '驳回'],
                    title: '签约单审核'
                }, function () {
                    // 如果通过 修改流程为 8
                    layer.confirm(
                        '最终购房成交金额：<input id="contractMoney" type="text" style="height:22px;" /> 万<br/><br/>' +
                        '应付推荐佣金：<input id="makeMoney" type="text" style="height:22px;" /> 元<br/>' +
                        '',{
                        title: '确认签约单审核'
                    },function () {
                        if (!$("#makeMoney").val() || !$("#contractMoney").val()) {
                            return layer.msg('请填写完整后提交!', {icon: 1, time: 1000});
                        }
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateByMakeMoney',
                            data: {
                                recordId: recordId,
                                approveMessage: '您的签约单审核完毕，等待确认！',
                                recommendFlow: '8',
                                makeMoney: $("#makeMoney").val(),
                                contractMoney: $("#contractMoney").val()
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        })
                    })
                }, function () {
                    // 如果不通过 修改流程为 6 重新上传签约单
                    // layer.confirm('确定要驳回签约单吗？', function () {
                    layer.prompt({title: '请填写驳回的理由', formType: 2}, function (text, index) {
                        layer.close(index);
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendFlow: '6',
                                approveMessage: '驳回的原因：' + text,
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        })
                    });
                });
                break;
            case 9:
                layer.confirm(
                    // '确定已经给经纪人打款?<br/>确定：推荐单完成<br/><br/>' +
                    '结算类型：<select name="recommendGettype" id="recommendGettype">' +
                    '<option value="2">正常结算</option>' +   //
                    '<option value="1">提前结算</option>' +   //
                    '</select><br/><br/>' +
                    '结算实付推荐佣金：<input id="recommendSendmoney" type="text" style="height:22px;" /> 元<br/>' ,{
                        title: '推荐单实付款确认'
                    }, function (index) {
                        if (!$("#recommendSendmoney").val()) {
                            return layer.msg('请填写真实打款金额', {icon: 1, time: 1000});
                        }
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateByRecommendSendmoney',
                            data: {
                                recordId: recordId,
                                recommendGettype:$("#recommendGettype").val(),
                                recommendSendmoney: $("#recommendSendmoney").val(),
                                recommendFlow: '10',
                                // recommendStatus:'4',
                                approveMessage: '此推荐单已结束，佣金已打致您的账户！'
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            },
                        });

                    });
                break;
            case 905:
                layer.confirm('请复核签约单，并于甲方沟通，是否通过？<br/>通过：流转甲方复核&nbsp;&nbsp;驳回：经纪人重新上传', {
                    btn: ['通过', '驳回'], //按钮
                    title: '代客确认单审核'
                }, function () {
                    layer.confirm('确定要复核签约单吗？', function () {
                        // 如果通过 修改流程为 8
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendFlow: '8',
                                approveMessage: '待客确认单已审核完毕,请在保护期内完成签约!'
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        })
                    })
                }, function () {
                    // 如果不通过 流程改为6（重新上传 真实确认单）
                    // layer.confirm('确定要驳回复核签约单吗？', function () {
                    layer.prompt({title: '请填写驳回的理由', formType: 2}, function (text, index) {
                        layer.close(index);
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/recommendRecord/updateRecommendFlow',
                            data: {
                                recordId: recordId,
                                recommendFlow: '6',
                                approveMessage: "驳回的原因：" + text,
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("审核失败", {icon: 1, time: 1000});
                                    return;
                                }
                                location.replace(location.href);
                            },
                            error: function (data) {
                                layer.msg('网络错误!', {icon: 1, time: 1000});
                            }
                        })
                    });
                });
                break;
        }
    },

    /*搜索search*/ //新房recommend_search
    recommend_search: function (curr) {//
        $.ajax({
            type: 'POST',
            url: urlScope + '/recommendRecord/houtaiByCommunity',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                communityId: $("#communityId").val(),
                recommendStatus: $("#recommendStatus").val(),
                recommendFlow: $("#findBySellersId").val()
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
                            panel.recommend_search(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*二手房search*/
    second_search: function (curr) {//
        $.ajax({
            type: 'POST',
            url: urlScope + '/recommendRecord/houtaiByHouse',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                communityId: $("#communityId").val(),
                recommendStatus: $("#recommendStatus").val(),
                recommendFlow: $("#findBySellersId").val()
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
                            panel.packQueryData(data)(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*根据状态选择*/
    recommendStatus: function (curr) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlScope + '/recommendRecord/houtaiByCommunity',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                communityId: $("#communityId").val(),
                recommendStatus: $("#recommendStatus").val(),
                recommendFlow: $("#findBySellersId").val()
            },
            success: function (data) {
                // panel.packQueryData(data, curr);
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
                            panel.recommendStatus(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*根据推荐单流程单号选择*/
    findBySellersId: function (curr) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlScope + '/recommendRecord/houtaiByCommunity',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                communityId: $("#communityId").val(),
                recommendStatus: $("#recommendStatus").val(),
                recommendFlow: $("#findBySellersId").val()
            },
            success: function (data) {
                // panel.packQueryData(data, curr);
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
                            panel.findBySellersId(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    describe: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    packQueryData: function (data) {//封装数据
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }
        var w = data.object;
        var dataArr = w.data;
        var tag = "";
        for (var i = 0; i < dataArr.length; i++) {
            var recommendStatus = "";
            switch (dataArr[i].recommendStatus) {
                // 查基本小区
                case "1" :
                    recommendStatus = "正常";
                    break;
                case "2" :
                    recommendStatus = "取消";
                    break;
                case "3" :
                    recommendStatus = "签约";
                    break;
                default:
                    recommendStatus = "完成";
            }
            ;
            var recommendFlow = "";
            switch (dataArr[i].recommendFlow) {
                // 查基本小区
                case "1" :
                    recommendFlow = "已推荐";
                    break;
                case "2" :
                    recommendFlow = "推荐单已审核";
                    break;
                case "3" :
                    recommendFlow = "推荐单已确认";
                    break;
                case "4" :
                    recommendFlow = "上门已确认";
                    break;
                case "5" :
                    recommendFlow = "待客确认单已提交";
                    break;
                case "6" :
                    recommendFlow = "待客确认单已审核";
                    break;
                case "7" :
                    recommendFlow = "签约单已提交";
                    break;
                case "8" :
                    recommendFlow = "签约单已审核";
                    break;
                case "9" :
                    recommendFlow = "签约单已确认";
                    break;
                case "905" :
                    recommendFlow = "运营复核";
                    break;
                default:
                    recommendFlow = "佣金已发放";
            }

            tag += '<tr class="text-c">' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + dataArr[i].recommendUserName + '</td>' +
                '<td>' + dataArr[i].recommendProjectName + '</td>' +
                '<td>' + dataArr[i].recommendUserPhone + '</td>' +
                '<td>' + common.dateFormat(dataArr[i].recommendAddTime.time) + '</td>' +
                '<td class="td-status"><span class="  radius">' + recommendStatus + '</span>' +
                ' <input type="hidden" value=' + dataArr[i].recommendStatus + '> ' +
                '</td>' +
                '<td class="td-status"><span class="  radius">' + recommendFlow + '</span>' +
                ' <input type="hidden" value=' + dataArr[i].recommendFlow + '> ' +
                '</td>' +
                '<td><a href="javascript:;"  onclick=panel.describe("查看详情","recommend-manager-describe.html?id=' + dataArr[i].id + '","800","500") class="label label-success radius">详情</a></td>' +
                '<td class="td-status">';
            // 流程：1.已提交   状态：1.正常
            if (dataArr[i].recommendFlow == '1' && dataArr[i].recommendStatus == '1') {
                tag += '<a onClick=panel.updateTo2or6(' + dataArr[i].id + ',' + dataArr[i].recommendFlow + ') class="label-success  radius label">信息审核</a>';
            }
            // 流程：5.待客确认单已提交    状态：1.正常
            if (dataArr[i].recommendFlow == '5' && dataArr[i].recommendStatus == '1') {
                tag += '<a onClick=panel.updateTo2or6(' + dataArr[i].id + ',' + dataArr[i].recommendFlow + ') class="label-success  radius label">带客审核</a>';
            }
            // 流程：7.待客确认单已提交    状态：1.正常
            if (dataArr[i].recommendFlow == '7' && dataArr[i].recommendStatus == '1') {
                tag += '<a onClick=panel.updateTo2or6(' + dataArr[i].id + ',' + dataArr[i].recommendFlow + ') class="label-success  radius label">签约审核</a>';
            }
            // 流程：9.签约单已确认    状态：3.已签约
            if (dataArr[i].recommendFlow == '9' && dataArr[i].recommendStatus == '3') {
                tag += '<a onClick=panel.updateTo2or6(' + dataArr[i].id + ',' + dataArr[i].recommendFlow + ') class="label-success  radius label">打款确认</a>';
            }
            // 流程：905.签约单复审   状态：1.正常
            if (dataArr[i].recommendFlow == '905' && dataArr[i].recommendStatus == '1') {
                tag += '<a onClick=panel.updateTo2or6(' + dataArr[i].id + ',' + dataArr[i].recommendFlow + ') class="label-success radius label">签约复核</a>';
            }

            if (dataArr[i].recommendFlow == '2') {
                tag += '<a  class=" radius label">推荐审核</a>';
            }
            if (dataArr[i].recommendFlow == '1' && dataArr[i].recommendStatus == '2') {
                tag += '<a  class=" radius label">信息未通过</a>';
            }
            if (dataArr[i].recommendFlow == '3') {
                tag += '<a  class=" radius label">推荐已确认</a>';
            }
            if (dataArr[i].recommendFlow == '4' && dataArr[i].recommendStatus == '1') {
                tag += '<a  class=" radius label">上门已确认</a>';
            }
            if (dataArr[i].recommendFlow == '6') {
                tag += '<a  class=" radius label">带客已审核</a>';
            }
            if (dataArr[i].recommendFlow == '8') {
                tag += '<a class="  radius label">签约审核</a>';
            }
            if (dataArr[i].recommendFlow == '10') {
                tag += '<a class=" radius label">已打款</a>';
            }
            tag +=
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
    $("#qu").change(function () {
        panel.bind_communitySelect(this);
    });
});
