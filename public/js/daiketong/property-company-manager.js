'use strict';
var panel = {
    init: function () {
        this.propertyPagIng();
        setInterval(function () {
            panel.propertyPagIng();
        },100000)
    },

    propertyPagIng: function (curr) { //分页
        $.ajax({
            type: 'POST',
            url: urlScope + '/Property/findAllByPage',
            dataType: 'json',
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
                            panel.propertyPagIng(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    // /*项目-搜索search*/
    property_search: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Property/findAllByPage',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                propertyName: $("#propertyName").val(),
                propertyStatus: $("#propertyProState").val()
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
                            panel.property_search(obj.curr);
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
    property_add: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    // /*根据状态操作
    property_stop_start: function(obj, propertyId, propertyStatus) {
        propertyStatus = propertyStatus == '1' ? '0' : '1';
        layer.confirm(propertyStatus == '1' ? '确定要启用吗？' : '确定要禁用吗？', function(index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/Property/updateProperty',
                data: {
                    propertyId: propertyId,
                    propertyStatus: propertyStatus
                },
                dataType: 'json',
                success: function(data) {
                    layer.msg(data.result == '1' ? '启用失败' : '禁用失败', { icon: 1, time: 1000 });
                    location.replace(location.href);
                },
                error: function(data) {
                    layer.msg('网络错误!', { icon: 1, time: 1000 });
                },

            });
        });
    },

    /*根据状态选择*/
    propertyProState: function(curr) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            url: urlScope + '/Property/findAllByPage',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                propertyName: $("#propertyName").val(),
                propertyStatus: $("#propertyProState").val()
            },
            success: function(data) {
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
                            panel.propertyProState(obj.curr);
                        }
                    }
                });
            },
            error: function(data) {
                layer.msg('网络错误!', { icon: 1, time: 1000 });
            },
        });
    },

    packQueryData: function (data) {//封装数据
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }
        var w = data.object;
        var data = w.data;
        var tag = '';
        for (var i = 0; i < data.length; i++) {
            var propertyStatus = data[i].propertyStatus == '1' ?  "启用" : "禁用";
            var classSuccess = data[i].propertyStatus == '1' ? 'label-success' : '';
            tag +=
                `<tr class="text-c">
                <td>${(i + 1)}</td>
                <td>${data[i].propertyName }</td>
                <td>${ common.dateFormat(data[i].addTime.time)}</td>
                <td class="td-status"><span class="label ' + classSuccess + ' radius">${ propertyStatus }</span>
                <input type=hidden  value=${data[i].propertyStatus} id=proStatusId>
                </td>
                <td class="f-14 product-brand-manage">
                <a class="label label-success radius" onClick="panel.property_stop_start(this,${ data[i].propertyId },${ data[i].propertyStatus })" href="javascript:;" title="禁用" style="text-decoration:none" >修改状态</a>
                </td>
                </tr>`;
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
});
