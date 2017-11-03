var panel = {
    init: function () {
        this.informationPagIng();

    },

    informationPagIng: function (curr) {
        $.ajax({
            type: "post",
            url: urlScope + "/information/findAllByPage",
            dataType: "json",
            data: {
                page: curr || 1,
                rows: 10
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
                            panel.informationPagIng(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    information_del: function (obj, informationId) {
        layer.confirm('确认要删除吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/information/deleteInformation',
                data: {
                    informationId: informationId
                },
                dataType: 'json',
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg('删除数据失败', {icon: 1, time: 1000});
                        return;
                    }
                    layer.msg('已删除!', {icon: 1, time: 1000});
                    location.replace(location.href);

                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                },
            });
        });
    },

    deleSeltedRecords: function () {
        var checkboxItem = $("table > tbody > tr > td > input[type='checkbox']:checked");
        var ids = "";
        for (var i = 0; i < checkboxItem.length; i++) {
            ids += checkboxItem[i].parentElement.nextSibling.nextSibling.innerText + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        if (ids != "") {
            layer.confirm("确定删除所选记录？", function (index) {
                $.ajax({
                    type: "post",
                    url: urlScope + '/information/deleteInformation',
                    data: {
                        informationId: ids
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.result != '1') {
                            layer.msg('删除数据失败', {icon: 1, time: 1000});
                            return;
                        }
                        layer.msg('已删除!', {icon: 1, time: 1000});
                        location.replace(location.href);
                    },
                    error: function (data) {
                        layer.msg('网络错误!', {icon: 1, time: 1000});
                    }
                });
            });
        } else {
            layer.msg('请选择要删除的选项', {icon: 1, time: 1000});
        }
    },

    informationAdd: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    information_search: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/information/findAllByPage',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                informationTitle: $("#informationTitle").val()
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
                            panel.information_search(obj.curr);
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
        var tag = "";
        for (var i = 0; i < data.length; i++) {
            tag += '<tr class="text-c">' +
                '<td><input type="checkbox" value="" name=""></td>' +
                '<td>' + (i + 1) + '</td>' +
                '<td>' + data[i].informationId + '</td>' +
                '<td>' + data[i].informationTitle + '</td>' +//  onclick="this.style.zoom=5"
                '<td><img src="' + imgurl + 'information/' + data[i].informationPhoto + '")"></td>' +
                '<td>' + data[i].informationTxt + '</td>' +
                '<td>' + common.dateFormat(data[i].informationDate.time) + '</td>' +
                '<td class="td-manage">' +
                '<a title="删除" href="javascript:;" onclick=panel.information_del(this,' + data[i].informationId + ') class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>' +
                '</td>' +
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
});
