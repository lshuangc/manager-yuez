var panel = {
    init: function () {
        $("#communityId").val(common.getQueryString("communityId"));
        $("#id").val(common.getQueryString("id"));
        this.goodActivetyType();
        $('#activety_add').unbind('click').bind('click', this.goodActivetyAdd);
    },
    goodActivetyAdd: function () {
        var form = new FormData(document.getElementById("form-add"));
        if ($("#d4311").val() == "" || $("#d4312").val() == "" || $("#discountInformation").val() == "") {
            layer.msg("请填写完整再提交", {icon: 1, time: 1000});
            return;
        };
        $.ajax({
            type: "post",
            dataType: "json",
            url: urlScope + "/CommunityDetail/addUpDiscountInformation",
            data: form,
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                common.disabledButton("#activety_add");
            },
            success: function (data) {
                // var data = JSON.parse(data);
                if (data.result != 1) {
                    layer.msg('添加失败!', {icon: 1, time: 2000});
                } else {
                    layer.msg('添加成功!', {icon: 1, time:2000});

                };
                setTimeout(function () {
                    window.location.reload();
                },2000)

            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误', {icon: 1, time: 2000});
            }
        });

    },

    goodActivetyType: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/CommunityDetail/findDiscountInformation',
            dataType: 'json',
            data: {
                communityId:$("#communityId").val(),
                id:$("#id").val()
            },
            success: function (data) {
               data = data.object;
                if(data.endDiscountTime!=null){
                    var tag = '';

                    tag += '<tr class="text-c">' +
                        // '<td>' + "1" + '</td>' +
                        '<td>' + data.id + '</td>' +
                        '<td ondblclick="panel.ondblclickEditor1(this,' + data.id + ')" >' + common.dateFormat(data.startDiscountTime.time) + '</td>' +
                        '<td ondblclick="panel.ondblclickEditor2(this,' + data.id + ')"  >' + common.dateFormat(data.endDiscountTime.time) + '</td>' +
                        '<td ondblclick="panel.ondblclickEditor3(this,' + data.id + ')">' + data.discountInformation + '</td>' +
                        '<td class="td-manage">' +
                        '<a title="删除" href="javascript:;" onclick=panel.goodActivety_del(' + data.id + ',"800","500") class="ml-5" style="text-decoration:none"><i class="Hui-iconfont">&#xe6e2;</i></a>' +
                        '</td>' +
                        '</tr>';

                    $("tbody").html(tag);
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    goodActivety_del: function (id) {
        layer.confirm('确认要删除吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityDetail/deleteDiscountInformation',
                data: {
                    id: id
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

    ondblclickEditor1:function (element,id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        //为新增元素添加类型
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityDetail/addUpDiscountInformation',
                data: {
                    id: id,
                    startDiscountTime: $(this).val(),
                },
                dataType: 'json',
                success: function (data) {
                    panel.goodActivetyType;
                    if (data.result == '0') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }else {
                        layer.msg("修改成功", {icon: 1, time: 1000});
                    }
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
            });
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditor1(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },
    ondblclickEditor2:function (element,id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        //为新增元素添加类型
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityDetail/addUpDiscountInformation',
                data: {
                    id: id,
                    endDiscountTime: $(this).val(),
                },
                dataType: 'json',
                success: function (data) {
                    panel.goodActivetyType;
                    if (data.result == '0') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }else {
                        layer.msg("修改成功", {icon: 1, time: 1000});
                    }
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
            });
            //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditor2(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },
    ondblclickEditor3:function (element,id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        //为新增元素添加类型
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityDetail/addUpDiscountInformation',
                data: {
                    id: id,
                    discountInformation: $(this).val(),
                },
                dataType: 'json',
                success: function (data) {
                    panel.goodActivetyType;
                    if (data.result == '0') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }else {
                        layer.msg("修改成功", {icon: 1, time: 1000});
                    }
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }
            });
            //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditor3(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },

}

$(function () {
    panel.init();
});
