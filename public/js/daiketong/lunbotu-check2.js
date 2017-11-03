var panel = {
    init: function () {
        $("#configId").val(common.getQueryString("configId"));
        this.lunbotucheck2();

    },

    lunbotucheck2: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/ConfigControler/selectConfig',
            dataType: 'json',
            data: {
                type: 7,
                configId: $("#configId").val()
            },
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var data = data.object;
                var tag = '';
                for (var i = 0; i < data.length; i++) {
                    tag += '<tr class="text-c">' +
                        '<td>' + (i + 1) + '</td>' +
                        '<td><img  src="' + imgurl + 'carouselFigure/' + data[i].img + '" ></td>' +
                        '</tr>';
                }
                $("tbody").html(tag);
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },


}

$(function () {
    panel.init();
});
