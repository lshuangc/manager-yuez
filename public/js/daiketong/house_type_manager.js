var panel = {
    init: function () {
        $("#communityId").val(common.getQueryString("communityid"));
        this.type();
        this.getCommunityType();
        $('#type_add').unbind('click').bind('click', this.typeManagerAdd);
        $("#typeImgurl").change(function () {
            common.fileType(typeImgurl);
        });
    },


    getCommunityType: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/CommunityHousetype/getHouseTypesByCommunityId',
            dataType: 'json',
            data: {
                communityId: $("#communityId").val()
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
                        // '<td>' + data[i].id + '</td>' +
                        '<td><img   onclick="panel.ondblclickEdi(' + data[i].id + ')"  src="' + imgurl + 'communitytype/' + data[i].typeImgurl + '" ></td>' +
                        // '<td ondblclick="panel.ondblclickEditortypeDatail(this,' + data[i].id + ')">' + data[i].typeDatail + '</td>' +
                        '<td>' + data[i].housetypeName + '</td>' +
                        '<td ondblclick="panel.ondblclicktypeCommision(this,' + data[i].id + ')">' + data[i].typeCommision + '</td>' +
                        '<td ondblclick="panel.ondblclickEditortypeArea(this,' + data[i].id + ')">' + data[i].typeArea + '</td>' +
                        '</tr>';
                }
                $("tbody").html(tag);
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    type: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Housetype/findAll',
            dataType: 'json',
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var w = data.object;
                var tag = '<option value=" ">全部</option>';
                for (var i = 0; i < w.length; i++) {
                    tag += '<option value=' + w[i].id + '>' + w[i].housetypeName + '</option>';
                }
                $("#housetypeId").html(tag);
            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    typeManagerAdd: function () {
        var form = new FormData(document.getElementById("form-add"));
        if ($("#typeDatail").val() == "" || $("#housetypeId").val() == "" || $("#typeArea").val() == "" || $("#typeImgurl").val() == "" || $("#typeCommision").val() == "") {
            layer.msg("请填写完整再提交", {icon: 1, time: 1000});
            return;
        }
        ;
        $.ajax({
            type: "post",
            dataType: "json",
            url: urlScope + "/CommunityHousetype/addCommunityHousetype",
            data: form,
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                // common.disabledButton("#type_add");
            },
            success: function (data) {
                // var data = JSON.parse(data);
                if (data.result != 1) {
                    layer.msg('户型添加失败!', {icon: 1, time: 1000});
                } else {
                    layer.msg('户型添加成功!', {icon: 1, time: 1000});

                }
                ;
                window.location.reload();
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });

    },

    ondblclickEditortypeDatail: function (element, id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.value = oldhtml;

        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityHousetype/updateCommunityHousetype',
                data: {
                    id: id,
                    communityId: $("#communityId").val(),
                    typeDatail: $(this).val(),
                },
                dataType: 'json',
                success: function (data) {
                    panel.getCommunityType;
                    if (data.result == '0') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }else if(data.result == '1'){
                        layer.msg("修改成功", {icon: 1, time: 1000});
                    }else {
                        layer.msg("修改失败，户型已经存在!", {icon: 1, time: 1000});
                    }
                    setTimeout(function () {
                        window.location.reload();
                    },1000);
                }
            });
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditortypeDatail(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },

    ondblclicktypeCommision: function (element, id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.value = oldhtml;

        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityHousetype/updateCommunityHousetype',
                data: {
                    id: id,
                    communityId: $("#communityId").val(),
                    typeCommision: $(this).val(),
                },
                dataType: 'json',
                success: function (data) {
                    panel.getCommunityType;
                    if (data.result == '0') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }else if(data.result == '1'){
                        layer.msg("修改成功", {icon: 1, time: 1000});
                    }else {
                        layer.msg("修改失败，户型已经存在!", {icon: 1, time: 1000});
                    }
                    setTimeout(function () {
                        window.location.reload();
                    },1000);
                }
            });
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditortypeDatail(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },

    ondblclickEditortypeArea: function (element, id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityHousetype/updateCommunityHousetype',
                data: {
                    id: id,
                    communityId: $("#communityId").val(),
                    typeArea: $(this).val(),
                },
                dataType: 'json',
                success: function (data) {
                    panel.getCommunityType;
                    if (data.result == '0') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }else if(data.result == '1'){
                        layer.msg("修改成功", {icon: 1, time: 1000});
                    }else {
                        layer.msg("修改失败，户型已经存在!", {icon: 1, time: 1000});
                    }
                    setTimeout(function () {
                        window.location.reload();
                    },1000);
                }
            });
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditortypeArea(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },

    ondblclickEdi: function (id) {
        var communityId = $("#communityId").val();
        layer.confirm('请选择要修改的图片：<br> <br>' +
            '<form id="formImg" enctype ="multipart/form-data">' +
            '<input type="file" style="height:22px;" id="type" name="typeImgurl"/>' +
            '<input type="text" style="display: none" name="id" value="' + id + '" />' +
            '<input type="text" style="display: none" name="communityId" value="' + communityId + '" />' +
            '</form> ', {
            btn: ['确定', '取消'],
            title: '选择图片'
        }, function () {
            var form3 = new FormData(document.getElementById("formImg"));
            if ($("#type").val() == "") {
                return layer.msg('请选择要修改的图片!', {icon: 1, time: 2000});
            }
            $.ajax({
                type: 'POST',
                url: urlScope + '/CommunityHousetype/updateCommunityHousetype',
                data: form3,
                dataType: 'json',
                processData: false,
                contentType: false,
                xhrFields: {withCredentials: true},
                success: function (data) {
                    if (data.result != '1') {
                        layer.msg("修改失败", {icon: 1, time: 1000});
                        return;
                    }
                    layer.msg("修改成功", {icon: 1, time: 1000});
                    location.replace(location.href);
                },
                error: function (data) {
                    layer.msg('网络错误!', {icon: 1, time: 1000});
                }
            });
        });
    }

}
$(function () {
    panel.init();
});
