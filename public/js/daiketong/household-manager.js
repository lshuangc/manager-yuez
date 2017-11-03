var panel = {
    init: function () {
        this.householdPagIng();
        // $('.houseType').unbind('click').bind('click', this.ShowElement(this));
    },

    householdPagIng: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Housetype/findAll',
            dataType: 'json',
            data: {
                page: curr || 1,
                rows: 10
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
                        // '<td class="id">' + data[i].id + '</td>' +
                        '<td class="houseType"  ondblclick="panel.ShowElement(this,' + data[i].id + ')">' + data[i].housetypeName + '</td>' +
                        '</tr>';
                }
                $("tbody").html(tag);
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    household_add: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    ShowElement: function (element, id) {
        var oldhtml = element.innerHTML;
        if (oldhtml.indexOf('type="text"') > 0) {
            return;
        }
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.onblur = function () {
            if (this.value == oldhtml) {
                element.innerHTML = oldhtml;
            } else {
                $.ajax({
                    type: 'POST',
                    url: urlScope + '/Housetype/updateHousetype',
                    data: {
                        id: id,
                        housetypeName: $(this).val()
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.result == '0') {
                            layer.msg("修改失败", {icon: 1, time: 1000});
                            return;
                        } else if (data.result == '1') {
                            layer.msg("修改成功", {icon: 1, time: 1000});
                        } else {
                            layer.msg("修改失败，户型已经存在!", {icon: 1, time: 1000});
                        }
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                });
                // element.innerHTML = this.value ? this.value : oldhtml;
                element.innerHTML = this.value;
            }
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
    },
}

$(function () {
    panel.init();
});

