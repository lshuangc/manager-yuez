var panel = {
    init: function () {
        this.signPagIng();
        // common.bind_Sanji();
    },

    // 移除列表
    remove_List: function () {
        // $("#CommunityHouse_btn").html(' ');
        $("#tbody").html(' ');
    },

    //选择类型
    change: function (e) {
        var typeValue = e.value;
        switch (typeValue) {
            case '1' :
                this.remove_List();
                this.signPagIng(1); //  新房
                break;
            case '2' :
                this.remove_List();
                this.secondHand(1); //  二手房
                break;
        }
    },

    // 搜索按钮
    search: function () {
        var typeValue = $("select[name = communityhouse-type]").val();
        switch (typeValue) {
            case '1' :
                this.sign_search(); // 新房
                break;
            case '2' :
                this.two_search();//二手房
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
                rows: 10,
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
    signPagIng: function (curr) {
        $.ajax({
            type: "post",
            url: urlScope + "/recommendRecord/houtaiSignedByCommunity",
            dataType: "json",
            data: {
                page: curr || 1,
                rows: 10,
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
                            panel.signPagIng(obj.curr);
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
            url: urlScope + "/recommendRecord/houtaiByHouse",
            data: {
                page: curr || 1,
                rows: 10
            },
            dataType: "json",
            success: function (data) {
                var pages = panel.secondPackQueryData(data);
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

    /*搜索search*/ //新房
    sign_search: function (curr) {//
        $.ajax({
            type: 'POST',
            // url: urlScope + '/recommendRecord/houtaiByCommunity',
            url: urlScope + '/recommendRecord/houtaiSignedByCommunity',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                communityId: $("#communityId").val(),
                // recommendFlow: 9,
                // recommendStatus: 3
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
                            panel.sign_search(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    /*搜索search*/
    two_search: function (curr) {//
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
                recommendFlow: 9,
                recommendStatus: 3
            },
            dataType: 'json',
            success: function (data) {
                var pages = panel.secondPackQueryData(data);
                laypage({
                    cont: $('#pageDiv'), //容器。值支持id名、原生dom对象，jquery对象,
                    pages: pages, //总页数
                    skip: true, //是否开启跳页
                    skin: '#5a98de',
                    groups: 5, //连续显示分页数
                    curr: curr || 1, //当前页
                    jump: function (obj, first) { //触发分页后的回调
                        if (!first) { //点击跳页触发函数自身，并传递当前页：obj.curr
                            panel.two_search(data)(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

//根据新房选择状态
    signStatus: function (curr) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlScope + '/recommendRecord/houtaiSignedByCommunity',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                communityId: $("#communityId").val(),
                recommendStatus:$("#signId").val(),
                recommendFlow:$("#signFlow").val()
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
                            panel.signStatus(obj.curr);
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
    describSign: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    packQueryData: function (data) {
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
                case "3" :
                    recommendStatus = "签约";
                    break;
                case "4" :
                    recommendStatus = "完成";
                    break;
            };
            var recommendFlow = "";
            switch (dataArr[i].recommendFlow) {
                case "9" :
                    recommendFlow = "签约单已确认";
                    break;
                case "10" :
                    recommendFlow = "佣金已发放";
                    break;
            }

            tag += '<tr class="text-c">' +
                '<td>' + (i + 1) + '</td>' +
                // '<td>' + dataArr[i].id + '</td>' +
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
                '<td><a href="javascript:;" onclick=panel.describSign("查看详情","sign-manager-describe.html?recordId=' + dataArr[i].id + '","800","500") class="label label-success radius">详情</a></td>' +
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

    secondPackQueryData: function (data) {
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
                case "3" :
                    recommendStatus = "签约";
                    break;
            };
            var recommendFlow = "";
            switch (dataArr[i].recommendFlow) {
                case "9" :
                    recommendFlow = "签约单已确认";
                    break;
            }
            tag += '<tr class="text-c">' +
                // '<td><input type="checkbox" value="" name=""></td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + dataArr[i].id + '</td>' +
                '<td>' + dataArr[i].recommendUserName + '</td>' +
                '<td>' + dataArr[i].recommendProjectName + '</td>' +
                '<td>' + dataArr[i].recommendUserPhone + '</td>' +   //5
                '<td>' + common.dateFormat(dataArr[i].recommendAddTime.time) + '</td>' +
                '<td class="td-status"><span class="radius">' + recommendStatus + '</span>' +
                ' <input type="hidden" value=' + dataArr[i].recommendStatus + '> ' +
                '</td>' +
                '<td class="td-status"><span class="  radius">' + recommendFlow + '</span>' +
                ' <input type="hidden" value=' + dataArr[i].recommendFlow + '> ' +
                '</td>' +
                '<td><a href="javascript:;"  onclick=panel.describSign("查看详情","sign-manager-describe.html?recordId=' + dataArr[i].id + '","800","500") class="label label-success radius">详情</a></td>' +
                '</tr>';
        }
        $("tbody").html(tag);
        $(".r > strong").html(w.totalNumber);
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
