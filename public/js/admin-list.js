var panel = {
    init: function () {
        common.isLogin(common.pageName());
        this.adminPagIng();
    },

    adminPagIng: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/admin/getAdminsBypage',
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
                            panel.adminPagIng(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            },
        });
    },

    admin_search: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/admin/getAdminsByConditions',
            data: {
                datemin: $("#datemin").val(),
                datemax: $("#datemax").val(),
                adminName: $("#adminName").val()
            },
            dataType: 'json',
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var data1 = data.object;
                var tag = '';
                for (var i = 0; i < data1.length; i++) {
                    var adminRole = data1[i].adminRole == '1' ? adminRole = "超级管理员" : adminRole = "普通管理员";
                    var status = data1[i].status == '1' ? status = "已启用" : status = "已停用";
                    var classSuccess = data1[i].status == '1' ? 'label-success' : '';
                    tag += '<tr class="text-c">' +
                        '<th>' + (i + 1) + '</th>' +
                        '<td>' + data1[i].adminName + '</td>' +
                        '<td>' + data1[i].phone + '</td>' +
                        '<td>' + data1[i].email + '</td>' +
                        '<td>' + adminRole + '</td>' +
                        '<td>' + common.dateFormat(data1[i].addTime.time) + '</td>' +
                        '<td>' + data1[i].remarks + '</td>' +
                        '<td class="td-status"><span class="label ' + classSuccess + ' radius">' + status + '</span></td>' +
                        '<td class="td-manage">';
                    if (data1[i].adminRole == '1') {
                        tag += '';
                    } else {
                        if (data1[i].status == '1') {
                            tag += '<a onClick="panel.admin_stop_start(this,' + data1[i].id + ',' + data1[i].status + ')" href="javascript:;" title="停用" style="text-decoration:none" class="label label-success radius" >修改状态</a>&nbsp;&nbsp;';
                        } else {
                            tag += '<a onClick="panel.admin_stop_start(this,' + data1[i].id + ',' + data1[i].status + ')" href="javascript:;" title="启用" style="text-decoration:none" class="label label-success radius" >修改状态</a>&nbsp;&nbsp;'
                        }
                        tag += ' <a title="编辑" href="javascript:;" onclick=panel.admin_edit("修改密码","admin-password-edit.html?id=' + data1[i].id + '","800","500") class="label label-success radius" style="text-decoration:none">修改密码</a>';
                    }
                    tag += '</td>' +
                        '</tr>';
                }
                $("tbody").html(tag);

                $(".r > strong").html(data1.length);
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    admin_add: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    admin_edit: function (title, url, id, w, h) {
        layer_show(title, url, w, h);
    },

    admin_stop_start: function (obj, id, status) {
        status = status == '1' ? '0' : '1';
        layer.confirm(status == '1' ? '确定要启用吗？' : '确定要停用吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/admin/updateAdminStatus',
                data: {
                    id: id,
                    status: status
                },
                dataType: 'json',
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg(status == '1' ? '启用失败' : '停用失败', {icon: 1, time: 1000});
                        return;
                    }
                    setTimeout(function () {
                        layer.msg(status == '0' ? '停用成功' : '启用成功', {icon: 1, time: 1000});
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

    packQueryData: function (data) {
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }
        var w = data.object;
        var data1 = w.data;
        var tag = '';
        for (var i = 0; i < data1.length; i++) {
            var adminRole = data1[i].adminRole == '1' ? adminRole = "超级管理员" : adminRole = "普通管理员";
            var status = data1[i].status == '1' ? status = "已启用" : status = "已停用";
            var classSuccess = data1[i].status == '1' ? 'label-success' : '';
            tag += '<tr class="text-c">' +
                '<th>' + (i + 1) + '</th>' +
                '<td>' + data1[i].adminName + '</td>' +
                '<td>' + data1[i].phone + '</td>' +
                '<td>' + data1[i].email + '</td>' +
                '<td>' + adminRole + '</td>' +
                '<td>' + common.dateFormat(data1[i].addTime.time) + '</td>' +
                '<td>' + data1[i].remarks + '</td>' +
                '<td class="td-status"><span class="label ' + classSuccess + ' radius">' + status + '</span></td>' +
                '<td class="td-manage">';

            if (data1[i].adminRole == '1') {
                // tag += '';
                tag += '<a  href="javascript:;" style="text-decoration:none" class="label  radius" >修改状态</a>&nbsp;&nbsp;';
                tag += ' <a title="编辑" href="javascript:;"  class="label  radius" style="text-decoration:none">修改密码</a>';
            } else {
                tag += '<a onClick="panel.admin_stop_start(this,' + data1[i].id + ',' + data1[i].status + ')" href="javascript:;" title="停用" style="text-decoration:none" class="label label-success radius" >修改状态</a>&nbsp;&nbsp;';
                tag += ' <a title="编辑" href="javascript:;" onclick=panel.admin_edit("修改密码","admin-password-edit.html?id=' + data1[i].id + '","800","500") class="label label-success radius" style="text-decoration:none">修改密码</a>';
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
        var pages = Math.ceil(w.totalNumber / w.pageSize);
        return pages;
    },

}

$(function () {
    panel.init();
});


