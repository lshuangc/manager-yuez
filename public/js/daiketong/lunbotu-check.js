var panel = {
    init: function () {
        $("#configId").val(common.getQueryString("configId"));
        this.lunbotucheck();
        $("#file_input").change(function() {common.fileType(file_input);});
        $(document).on("change","#carouselFigure",function() {common.fileType(carouselFigure);});

    },

    lunbotucheck: function () {
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
                        '<td><img   src="' + imgurl + 'carouselFigure/' + data[i].img + '" ></td>' +
                        '<td class="td-manage">' +
                        '<a title="替换" style="color: #0000ff" href="javascript:;" onclick="panel.revise(' + data[i].id + ')" class="ml-5" style="text-decoration:none"><u>替换</u></a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<a title="删除" style="color: #0000ff" href="javascript:;" onclick=panel.lunbotu_del(this,' + data[i].id + ') class="ml-5" style="text-decoration:none"><u>删除</u></a>' +
                        '</td>' +
                        '</tr>';
                }
                $("tbody").html(tag);
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    //限制上传图片的数量
    fileCountCheck: function (objForm) {
        var trLength = $('#tbodyId > tr').length;
        var num = 8;
        if (window.File && window.FileList) {
            var fileCount = objForm["carouselFigureImg"].files.length;
            var maxFile = num - trLength;
            if (fileCount + trLength > num) {
                window.alert('页面上只能显示5-8张图片，最多只能选择' + maxFile + '张了');
                document.getElementById('carouselFigureImg').valal = '';
                return;
            }else {
                window.alert('页面上只能显示5-8张图片，你选择了' + fileCount + '张');
                panel.lunbotucheckAdd();
            }
        }
        else {
            window.alert('抱歉，你的浏览器不支持FileAPI，请升级浏览器！');
        }
        return false;
    },

    lunbotucheckAdd: function () {
        var form = new FormData(document.getElementById("form-add"));
        if(!$("#carouselFigureImg").val()){
            layer.msg('请选择图片后提交!', {icon: 1, time: 1000});
            return;
        }
        $.ajax({
            type: "post",
            dataType: "json",
            url: urlScope + "/ConfigControler/addCarouselFigure",
            data: form,
            processData: false,
            contentType: false,
            xhrFields: {withCredentials: true},
            beforeSend: function () {
                // common.disabledButton("#add");
            },
            success: function (data) {
                if (data.result != 1) {
                    layer.msg('添加失败!', {icon: 1, time: 1000});
                } else {
                    layer.msg('添加成功!', {icon: 1, time: 1000});
                };
                window.location.reload();
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },


    lunbotu_del: function (obj, id) {
        layer.confirm('确认要删除吗？', function (index) {
            $.ajax({
                type: 'POST',
                url: urlScope + '/ConfigControler/deleteConfig',
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

    revise:function (id) {
        var configId = $("#configId").val();
        layer.confirm('请选择要修改的图片：<br> <br>' +
            '<form id="form_img" enctype ="multipart/form-data">' +
                '<input type="file" style="height:22px;" id="carouselFigure" name="carouselFigureImg"/>'+
                '<input type="text" style="display: none" name="type" value="7" />'+
                '<input type="text" style="display: none" name="id" value="'+id+'" />'+
                '<input type="text" style="display: none" name="configId" value="'+configId+'" />'+
            '</form> ', {
            btn: ['确定', '取消'],
            title: '选择图片'
        }, function () {
            var form3 = new FormData(document.getElementById("form_img"));
            if($("#carouselFigure").val() == ""){return  layer.msg('请选择要修改的图片!', {icon: 1, time: 2000});}
            $.ajax({
                type: 'POST',
                url: urlScope + '/ConfigControler/updateConfig',
                data:form3,
                dataType: 'json',
                processData:false,
                contentType:false,
                xhrFields:{withCredentials:true},
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
