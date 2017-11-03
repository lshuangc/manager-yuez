var panel_CommunityHouse = {
    init: function () {
        common.bind_Sanji(); // 省市区联动
        this.findAllCommunity3(1); // 新房
    },
    // 选择类型
    change_CommunityHouseType: function (e) {
        var typeValue = e.value;
        switch (typeValue) {
            case '1' :
                this.remove_CommunityHousetypeList();
                this.findAllCommunity3(1); //  新房
                break;
            case '2' :
                this.remove_CommunityHousetypeList();
                // this.secondHand(1); //  二手房
                break;
        }
    },

    // 搜索按钮
    btn_findByScreen: function () {
        var typeValue = $("select[name = communityhouse-type]").val();
        switch (typeValue) {
            case '1' :
                this.communityHouse_search(); // 新房
                break;
            case '2' :
                this.second_search();//二手房
                break;
        }
    },

    //新房
    findAllCommunity3: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/CommunityDetail/findToHouTai',
            dataType: 'json',
            data: {
                page: curr || 1,
                rows: 10,
                type:2
            },
            success: function (data) {
                var pages = panel_CommunityHouse.packQueryData_Community(data, curr);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { // 点击跳页触发函数自身，并传递当前页：obj.curr
                            panel_CommunityHouse.findAllCommunity(obj.curr);
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
    // secondHand: function (curr) {
    //     var name = $("input[name=Screen_name]").val();
    //     var provinceCode = $("select[name=Screen_provinceCode]").val();
    //     var cityCode = $("select[name=Screen_cityCode]").val();
    //     var countyCode = $("select[name=Screen_countyCode]").val();
    //     var housetypeId = $("select[name=Screen_housetypeId]").val();
    //     $.ajax({
    //         type: 'POST',
    //         url: urlScope + '/house/findToBackground',
    //         dataType: 'json',
    //         data: {
    //             // name: name,
    //             // provinceCode: provinceCode,
    //             // cityCode: cityCode,
    //             // countyCode: countyCode,
    //             // housetypeId: housetypeId,
    //             page: curr || 1,
    //             rows: 10,
    //             // status: false
    //         },
    //         success: function (data) {
    //             var pages = panel_CommunityHouse.secondHand_Community(data, curr);
    //             laypage({
    //                 cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
    //                 pages: pages, //总页数
    //                 skip: true, //是否开启跳页
    //                 skin: '#5a98de',
    //                 groups: 5, //连续显示分页数
    //                 curr: curr || 1, //当前页
    //                 jump: function (obj, first) { //触发分页后的回调
    //                     if (!first) { // 点击跳页触发函数自身，并传递当前页：obj.curr
    //                         panel_CommunityHouse.secondHand(obj.curr);
    //                     }
    //                 }
    //             });
    //         },
    //         error: function (data) {
    //             layer.msg('网络错误', {icon: 1, time: 1000});
    //         }
    //     });
    // },

    // 移除列表
    remove_CommunityHousetypeList: function () {
        $("#CommunityHouse_btn").html(' ');
        $("#CommunityHouse_table").html(' ');
    },

    //弹出框
    communityhouseAdd: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    ///*根据状态操作新房
    community_stop_start: function (id, detailStatus) {
        switch (detailStatus) {
            case 0 :
                layer.confirm('确定要修改为停用吗？', function (index) {
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/CommunityDetail/updateCommunityDetail',
                        data: {
                            id: id,
                            detailStatus: 1
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.result != '1') {
                                layer.msg("修改为停用失败", {icon: 1, time: 1000});
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
            case 1 :
                layer.confirm('确定要修改为启用吗？', function () {
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/CommunityDetail/updateCommunityDetail',
                        data: {
                            id: id,
                            detailStatus: 0
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.result != '1') {
                                layer.msg("修改为启用失败", {icon: 1, time: 1000});
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
            case 2 :
                // detailStatus = "待审核";
                // layer.confirm('请填写推荐佣金比例：<br/><br/><input id="recommendPercentage" type="text" style="height:22px;" /> %', {
                layer.confirm('请仔细确认是否为通过还是驳回？', {
                    btn: ['通过', '驳回'],
                    title: '审核小区',
                }, function () {
                    // if ($("#recommendPercentage") == "") {
                    //     layer.msg("请填写推荐佣金比例后提交", {icon: 1, time: 1000});
                    //     return;
                    // }
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/CommunityDetail/updateCommunityDetail',
                        data: {
                            id: id,
                            detailStatus: 0,
                            reviewInformation: "申请已通过",
                            // recommendPercentage: $("#recommendPercentage").val()
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
                }, function () {
                    layer.prompt({title: '请填写未通过理由', formType: 2}, function(text, index){
                        layer.close(index);
                        $.ajax({
                            type: 'POST',
                            url: urlScope + '/CommunityDetail/updateCommunityDetail',
                            data: {
                                id: id,
                                detailStatus: 4,
                                reviewInformation:"审核未通过原因：" +text,
                                // recommendPercentage: text
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.result != '1') {
                                    layer.msg("驳回失败", {icon: 1, time: 1000});
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
        };
    },

    community_see3: function (id, detailStatus) {
        switch (detailStatus) {
            case 1 :
                layer.confirm('请先在操作栏将状态修改为启用后，才可查看优惠活动', {
                    shadeClose: true, //开启遮罩关闭
                    closeBtn: 0, //不显示关闭按钮
                    title: '优惠活动提示'
                });
                break;
            case 2 :
                layer.confirm('请先在操作栏将待审核通过，然后在操作栏将状态修改为启用后，才可查看优惠活动', {
                    shadeClose: true, //开启遮罩关闭
                    closeBtn: 0, //不显示关闭按钮
                    title: '优惠活动提示'
                });
            case 4 :
                layer.confirm('审核未通过，暂时还不能查看优惠活动', {
                    shadeClose: true, //开启遮罩关闭
                    closeBtn: 0, //不显示关闭按钮
                    title: '优惠活动提示'
                });
        }
        ;
    },

    ///*根据状态操作二手房
    secondHand_stop_start: function (id, houseStatus) {
        switch (houseStatus) {
            case 0 :
                layer.confirm('确定要修改为启用吗？', function (index) {
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/house/updatHouse',
                        data: {
                            id: id,
                            houseStatus: 1
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.result != '1') {
                                layer.msg("修改为启用失败", {icon: 1, time: 1000});
                                return;
                            }
                            layer.msg('修改为启用成功!', {icon: 1, time: 1000});
                            setTimeout(function () {
                                // window.parent.location.reload();
                                window.location.reload();
                            }, 2000)
                        },
                        error: function (data) {
                            layer.msg('网络错误!', {icon: 1, time: 1000});
                        },
                    });
                });
                break;
            case 1 :
                layer.confirm('确定要修改为停用吗？', function () {
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/house/updatHouse',
                        data: {
                            id: id,
                            houseStatus: 0
                        },
                        dataType: 'json',
                        success: function (data) {
                            if (data.result != '1') {
                                layer.msg("修改为停用失败", {icon: 1, time: 1000});
                                return;
                            }
                            layer.msg('修改为停用成功!', {icon: 1, time: 1000});
                            setTimeout(function () {
                                // window.parent.location.reload();
                                window.location.reload();
                            }, 2000)
                        },
                        error: function (data) {
                            layer.msg('网络错误!', {icon: 1, time: 1000});
                        },

                    });
                });
                break;
            case 2 :
                layer.confirm('请填写推荐佣金比例：<br/><br/><input id="housePercentage" type="text" style="height:22px;" /> %', {
                    btn: ['通过', '取消'],
                    title: '审核小区'
                }, function () {
                    if ($("#housePercentage") == "") {
                        layer.msg("请填写推荐佣金比例后提交", {icon: 1, time: 1000});
                        return;
                    }
                    $.ajax({
                        type: 'POST',
                        url: urlScope + '/house/updatHouse',
                        data: {
                            id: id,
                            houseStatus: 0,
                            housePercentage: $("#housePercentage").val()
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
                break;
        }
        ;
    },

    /*新房search*/
    communityHouse_search: function (curr) {//
        $.ajax({
            type: 'POST',
            url: urlScope + '/CommunityDetail/findToHouTai',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                communityName: $("#communityName").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                housetypeId: $("#houseType").val(),
                detailStatus: $("#detailStatus").val()
            },
            dataType: 'json',
            success: function (data) {
                var pages = panel_CommunityHouse.packQueryData_Community(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel_CommunityHouse.communityHouse_search(obj.curr);
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
            url: urlScope + '/house/findToBackground',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                name: $("#communityName").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                housetypeId: $("#houseType").val(),
                houseStatus: $("#detailStatus").val(),
                type:2
            },
            dataType: 'json',
            success: function (data) {
                var pages = panel_CommunityHouse.secondHand_Community(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel_CommunityHouse.second_search(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*根据状态选择新房*/
    detailStatusXuan: function (curr) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlScope + '/CommunityDetail/findToHouTai',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                communityName: $("#communityName").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                housetypeId: $("#houseType").val(),
                detailStatus: $("#detailStatus").val(),
                type:2
            },
            success: function (data) {
                // panel_CommunityHouse.packQueryData_Community(data, curr);
                var pages = panel_CommunityHouse.packQueryData_Community(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel_CommunityHouse.detailStatusXuan(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*根据状态选择二手房*/
    secondHandStatus: function (curr) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlScope + '/house/findToBackground',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                name: $("#communityName").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                housetypeId: $("#houseType").val(),
                houseStatus: $("#houseStatus").val()
            },
            success: function (data) {
                panel_CommunityHouse.secondHand_Community(data, curr);
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    goodActivety_edit: function (title, url, id, w, h) {
        layer_show(title, url, w, h);
    },

    // 封装 新房数据
    packQueryData_Community: function (data, curr) {
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }
        var result_object = data.object;
        var result_data = result_object.data;
        var str_table = '' ;
            // '<thead>' +
        //     '<tr class="text-c">' +
        //     '<th width="30">序号</th>' +
        //     '<th width="100">小区封面</th>' +
        //     '<th width="100">小区名称</th>' +
        //     '<th width="150">小区地址</th>' +
        //     '<th width="100">户型范围</th>' +
        //     '<th width="80">面积范围</th>' +
        //     '<th width="60">均价(元)</th>' +
        //     '<th width="60">起价(元)</th>' +
        //     '<th width="60">佣金(元)</th>' +
        //     '<th width="130">数据添加时间</th>' +
        //     '<th width="130">最新开盘日期</th>' +
        //     '<th width="130">最早交房日期</th>' +
        //     '<th width="100">物业公司</th>' +
        //     '<th width="100">开发商</th>' +
        //     '<th width="150">销售商</th>' +
        //     '<th>' +
        //     '<select name="" id="detailStatus" onchange="panel_CommunityHouse.detailStatusXuan()"> ' +
        //     '<option value="">状态</option>' +
        //     '<option value="0">启用</option>' +
        //     '<option value="1">停用</option>' +
        //     '<option value="2">待审核</option>' +
        //     '<option value="4">未通过</option>' +
        //     '</select>' +
        //     '</th>' +
        //     '<th width="30">操作</th>' +
        //     '<th width="60">优惠活动</th>' +
        //     '</tr>' +
        //     '</thead>' +
        //     '<tbody>';
        for (var i = 0; i < result_data.length; i++) {
            var detailStatus = "";
            switch (result_data[i].detailStatus) {
                case "0" :
                    detailStatus = "启用";
                    break;
                case "1" :
                    detailStatus = "停用";
                    break;
                case "2" :
                    detailStatus = "待审核";
                    break;
                case "4" :
                    detailStatus = "未通过";
                    break;
            }
            ;
            str_table += '<tr class="text-c">' +
                '<td>' + (i + 1) + '</td>' +
                '<td><img src="' + imgurl + 'community/' + result_data[i].imgUrl + '" ></td>' +
                '<td>' + result_data[i].name + '</td>' +
                '<td>' + result_data[i].provinceName + ',' + result_data[i].cityName + ',' + result_data[i].countyName + ',' + result_data[i].address + '</td>' +
                '<td>' + result_data[i].houseTypeRange + '</td>' +
                '<td>' + result_data[i].houseProportionRange + '</td>' +
                '<td>' + result_data[i].averagePrice + '</td>' +
                '<td>' + result_data[i].houseSp + '</td>' +
                '<td>' + result_data[i].recommendCommission + '</td>' +
                '<td>' + common.dateFormat(result_data[i].communityDetailAddtime.time) + '</td>' +
                '<td>' + common.dateFormat(result_data[i].latestSaleTime.time) + '</td>' +
                '<td>' + common.dateFormat(result_data[i].firstHandTime.time) + '</td>' +
                '<td>' + result_data[i].propertyName + '</td>' +
                '<td>' + result_data[i].devloper + '</td>' +
                '<td>' + result_data[i].sellerCompanyName + '</td>' +
                '<td class="td-status"><span class="">' + detailStatus + '</span>' +
                '<input type=hidden  value=' + result_data[i].detailStatus + ' id=proStatusId>' +
                '</td>' +
                '<td class="f-14 product-brand-manage">';
            if (result_data[i].detailStatus == '0' || result_data[i].detailStatus == '1') {
                str_table += '<a onClick=panel_CommunityHouse.community_stop_start(' + result_data[i].id + ',' + result_data[i].detailStatus + ') class="label-success  radius label">修改状态</a>';
            }
            if (result_data[i].detailStatus == '2') {
                str_table += '<a onClick=panel_CommunityHouse.community_stop_start(' + result_data[i].id + ',' + result_data[i].detailStatus + ') class="label-success radius label">待审核</a>';
            }
            // if (result_data[i].detailStatus == '4') {
            //     str_table += '<a onClick=panel_CommunityHouse.community_stop_start(' + result_data[i].id + ',' + result_data[i].detailStatus + ') class="label-success radius label">未通过</a>';
            // }
            if (result_data[i].detailStatus == '4') {
                str_table += '<a  class=" radius label">未通过</a>';
            }
            str_table += '</td>' +
                '<td class="td-manage">';
            if (result_data[i].detailStatus == '0') {
                str_table += '<a href="javascript:;" onclick=panel_CommunityHouse.goodActivety_edit("优惠活动","good-activety2.html?communityId=' + result_data[i].communityId + '&id=' + result_data[i].id + '","1","1000","700") class="label-success  radius label">优惠活动</a>';
            }
            if (result_data[i].detailStatus == '2' || result_data[i].detailStatus == '1' || result_data[i].detailStatus == '4') {
                str_table += '<a href="javascript:;" onclick=panel_CommunityHouse.community_see3(' + result_data[i].id + ',' + result_data[i].detailStatus + ') class="label-success radius label">优惠活动</a>';
            }
            str_table += '</td>' +
                '</tr>';
        }
        str_table = '</tbody>' + str_table;

        $("#CommunityHouse_table").html(str_table);
        //分页部分代码
        $(".r > strong").html(result_object.totalNumber); // 总条数
        if(w.totalNumber==0){
            $("#pageDiv").hide();
        }else {
            $("#pageDiv").show();
        }
        var pages = Math.ceil(result_object.totalNumber / result_object.pageSize); // 计算总页数
        return pages;
    },

  //封装二手房数据
    // secondHand_Community: function (data) {
    //     if (data.result != '1') {
    //         layer.msg('获取数据失败', {icon: 1, time: 1000});
    //         return;
    //     }
    //     var result_object = data.object;
    //     var result_data = result_object.data;
    //     var str_btn = '<a href="javascript:;" onclick=panel_CommunityHouse.communitySecondAdd("添加二手房","communityhouse-second-add.html","800","500") class="btn btn-primary radius"><i class="Hui-iconfont">&#xe600;</i> 添加二手房</a>';
    //     var str_table = '<thead>' +
    //         '<tr class="text-c">' +
    //         '<th width="30">序号</th>' +
    //         // '<th width="50">所属小区id</th>' +
    //         '<th width="100">户型缩略图</th>' +
    //         '<th width="100">所属小区名称</th>' +
    //         '<th width="150">地址</th>' +
    //         '<th width="100">所属小区的坐标</th>' +
    //         '<th width="80">户型别名</th>' +
    //         '<th width="80">户型规格</th>' +
    //         '<th width="100">二手房名称</th>' +
    //         '<th width="80">二手房面积</th>' +
    //         '<th width="70">单价</th>' +
    //         '<th width="80">推荐佣金</th>' +
    //         '<th width="50">楼层数</th>' +
    //         '<th width="50">房号</th>' +
    //         '<th width="100">数据添加时间</th>' +
    //         '<th width="50">' +
    //         '<select name="" id="houseStatus" onchange="panel_CommunityHouse.secondHandStatus()"> ' +
    //         '<option value="">二手房状态</option>' +
    //         '<option value="0">停用</option>' +
    //         '<option value="1">启用</option>' +
    //         '<option value="2">待审核</option>' +
    //         '</select>' +
    //         '</th>' +
    //         '<th width="30">操作</th>' +
    //         '</tr>' +
    //         '</thead>' +
    //         '<tbody>';
    //     for (var i = 0; i < result_data.length; i++) {
    //         var houseStatus = result_data[i].houseStatus == '0' ? "在售" : "已售";
    //         // var classSuccess = result_data[i].houseStatus == '0' ? 'label-success' : '';
    //         var houseStatus = "";
    //         switch (result_data[i].houseStatus) {
    //             case "0" :
    //                 houseStatus = "停用";
    //                 break;
    //             case "1" :
    //                 houseStatus = "启用";
    //                 break;
    //             case "2" :
    //                 houseStatus = "待审核";
    //                 break;
    //         }
    //         ;
    //         str_table += '<tr class="text-c">' +
    //             '<td>' + (i + 1) + '</td>' +
    //             // '<td>' + result_data[i].id + '</td>' +
    //             '<td><img src="' + imgurl + 'house/' + result_data[i].typeImgurl + '" ></td>' +
    //             '<td>' + result_data[i].name + '</td>' +
    //             '<td>' + result_data[i].provinceName + ',' + result_data[i].cityName + ',' + result_data[i].countyName + ',' + result_data[i].address + '</td>' +
    //             '<td>' + result_data[i].coordinate + '</td>' +
    //             '<td>' + result_data[i].typeDetail + '</td>' +
    //             '<td>' + result_data[i].housetypeName + '</td>' +
    //             '<td>' + result_data[i].houseName + '</td>' +
    //             '<td>' + result_data[i].houseProportion + '</td>' +
    //             '<td>' + result_data[i].houseUnitPrice + '</td>' +
    //             '<td>' + result_data[i].houseProportion + '</td>' +
    //             '<td>' + result_data[i].floorNum + '</td>' +
    //             '<td>' + result_data[i].houseCode + '</td>' +
    //             '<td>' + common.dateFormat(result_data[i].houseAddtime.time) + '</td>' +
    //             '<td class="td-status"><span class=" ">' + houseStatus + '</span>' +
    //             '<input type=hidden  value=' + result_data[i].houseStatus + ' id=>' +
    //             '</td>' +
    //             '<td class="f-14 product-brand-manage">';
    //         if (result_data[i].houseStatus == '0') {
    //             str_table += '<a onClick=panel_CommunityHouse.secondHand_stop_start(' + result_data[i].id + ',' + result_data[i].houseStatus + ') class="label-success  radius label">修改状态</a>';
    //         }
    //         if (result_data[i].houseStatus == '1') {
    //             str_table += '<a onClick=panel_CommunityHouse.secondHand_stop_start(' + result_data[i].id + ',' + result_data[i].houseStatus + ') class="label-success  radius label">修改状态</a>';
    //         }
    //         if (result_data[i].houseStatus == '2') {
    //             str_table += '<a onClick=panel_CommunityHouse.secondHand_stop_start(' + result_data[i].id + ',' + result_data[i].houseStatus + ') class="label-success  radius label">待审核</a>';
    //         }
    //         str_table += '</td>' +
    //             '</tr>';
    //     }
    //     str_table += '</tbody>';
    //
    //     $("#CommunityHouse_table").html(str_table);
    //     $("#CommunityHouse_btn").html(str_btn);
    //     //分页部分代码
    //     $(".r > strong").html(result_object.totalNumber); // 总条数
    //     var pages = Math.ceil(result_object.totalNumber / result_object.pageSize); // 计算总页数
    //     return pages;
    // },

}

$(function () {
    panel_CommunityHouse.init();
    $(document).on("click",".a2",function () {
        $(this).addClass('btn-primary').siblings().removeClass('btn-primary');
    })
    $(document).on("click",".a2:nth-child(2)",function () {
        $("#xiangmu").hide();
    })
});