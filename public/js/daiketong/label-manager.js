'use strict';
var panel = {
    init: function () {
        this.labelPagIng();
    },

    labelPagIng: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Label/findAll',
            dataType: 'json',
            data: {
                page: curr || 1,
                rows: 10
            },
            success: function (data) {
                var pages = panel.packQueryData(data);
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
        var data = data.object;
        var tag = '';
        for (var i = 0; i < data.length; i++) {
            tag +=`<tr class="text-c">
                <td>${(i + 1)}</td>
                <td>${data[i].labelName}</td>
                <td class="td-manage">
                <a title="删除" href="javascript:;" onclick=panel.label_del(this,${data[i].id}) class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>
                </td>
                </tr>`;
        }
        $("tbody").html(tag);
    },

    label_del:function(obj, id) {
        layer.confirm('确认要删除吗？', function(index) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Label/deleteLabel',
            data: {
                id: id
            },
            dataType: 'json',
            success: function(data) {
            if(data.result != '1') {
                    layer.msg('删除数据失败', { icon: 1, time: 1000 });
            return;
                }
                layer.msg('已删除!', { icon: 1, time: 1000 });
                location.replace(location.href);

            },
            error: function(data) {
                layer.msg('网络错误!', { icon: 1, time: 1000 });
            },
        });
    });
},

    label_add: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

}

$(function () {
    panel.init();
});