var common = {
    showErrorTip: function (message, selector) {//错误提示
        var tag = '<div id="tip">' +
            '<span id="x" onclick="yincang()">×</span>' +
            '<strong>' + message + '</strong>' +
            '</div>';
        $(selector).html(tag);
    },

    showSuccessTip: function (message, selector) {//正确提示
        var tag =
            '<div id="tip">' +
            // '<span id="x">×</span>' +
            '<strong>' + message + '</strong>' +
            '</div>';
        $(selector).html(tag);
    },

    disabledButton: function (selector) {//禁用按钮  #5a98de
        $(selector).attr("style", "background: gray;");
        $(selector).attr("disabled", "disabled");
    },

    abledButton: function (selector) {//解除禁用
        $(selector).removeAttr("disabled");
        $(selector).removeAttr("style");
    },

    getQueryString: function (name) {//截取字符串
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    },

    dateFormat: function (time) {//重写日期格式
        var unixTimestamp = new Date(time);
        Date.prototype.toLocaleString = function () {
            var minutes = this.getMinutes() <= 10 ? "0" + this.getMinutes() : this.getMinutes();
            return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + minutes;
        };
        var commonTime = unixTimestamp.toLocaleString();
        return commonTime;
    },

    // 判断是否登录以及权限
    isLogin: function (url) {
        var result = false;
        $.ajax({
            type: 'post',
            url: urlScope + "/admin/isLogin",
            async: false,
            xhrFields: {withCredentials: true},
            success: function (json) {
                var json = JSON.parse(json);
                if (json.result != "1") {//1表示已登录
                    window.parent.location.reload();
                    window.location.href = './login.html';
                } else {
                    if (url) {
                        var adminRemarks = json.object.adminRole;
                        switch (url) {
                            case 'admin-list.html':
                                if (adminRemarks == '1') {
                                    result = true;
                                } else {
                                    // result = false;
                                    window.location.href = '../404.html';
                                }
                                break;
                        }
                    }
                }
            },
            error: function () {
                layer.msg('网络错误', {icon: 1, time: 1000});
            },
        });
        return result;
    },
    pageName: function () {
        var strUrl = location.href;
        var arrUrl = strUrl.split("/");
        var strPage = arrUrl[arrUrl.length - 1];
        return strPage;
    },

    //获取所有省份
    province: function () {
        $.ajax({
            type: 'POST',
            url: urlScope + '/org/getAllProvinces',
            dataType: 'json',
            success: function (data) {
                if (data.result != '1') {
                    layer.msg('获取数据失败', {icon: 1, time: 1000});
                    return;
                }
                var w = data.object;
                var tag = '<option value="">全部</option>';
                for (var i = 0; i < w.length; i++) {
                    tag += '<option value=' + w[i].code + '>' + w[i].name + '</option>';

                }
                $("#province").html(tag);

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    // 绑定三级联动
    bind_Sanji: function () {
        var city;
        $.ajax({
            type: 'POST',
            url: urlScope + '/org/getSanJi',
            // url: urlScope + '/org/getLinkage',
            dataType: 'json',
            data: {},
            success: function (data) {
                city = data.object;
                // 获取 三个下拉框(省,市,区)
                var sheng = document.getElementById("sheng");
                var shi = document.getElementById("shi");
                var qu = document.getElementById("qu");
                // 给三个下拉框添加默认值
                sheng.options[0] = new Option("全部", " ");
                shi.options[0] = new Option("全部", " ");
                qu.options[0] = new Option("全部", " ");
                // 读取城市集合 三层循环添加分别添加 对应的 省 市 区
                // 1.第一层循环 添加省 (省是最大的,所以默认绑定所以的省)
                for (var i = 0; i < city.length; i++) {
                    // 从1开始 因为上面已经有默认值 长度就是 1++  / (i+1)
                    sheng.options[sheng.length] = new Option(city[i].name, city[i].code);
                    // 2.第二层循环 添加对应的 市
                    // 因为 是(省,市,区)对象数组 并且是相互对应的关系  所以当选择有 省 的时候,才能为其绑定对应的 市 (区 也是如此)
                    // 所以绑定 市 应该是根据选择的 省(也就是省的下拉框) 来绑定 根据 省下的市的个数来判断
                    // 当选择 省 的时候才会执行循环绑定其对应的市
                    sheng.onchange = function () {
                        // 绑定 市 之前要先清空之前绑定的 市  (区也是如此要清空之前绑定的 区)
                        shi.options.length = 0;
                        qu.options.length = 0;
                        // 清空之后重新 绑定默认的值 "情选择市"
                        shi.options[0] = new Option("全部", " ");
                        qu.options[0] = new Option("全部", " ");
                        // 完成清空之后 再开始绑定 市
                        for (var j = 0; j < city[sheng.selectedIndex - 1].shi.length; j++) {
                            shi.options[shi.length] = new Option(city[sheng.selectedIndex - 1].shi[j].name, city[sheng.selectedIndex - 1].shi[j].code);
                            // 3.第三层循环绑定 区 (同上,不过多解释)
                            shi.onchange = function () {
                                qu.options.length = 0;
                                qu.options[0] = new Option("全部", " ");
                                for (var k = 0; k < city[sheng.selectedIndex - 1].shi[shi.selectedIndex - 1].qu.length; k++) {
                                    qu.options[qu.length] = new Option(city[sheng.selectedIndex - 1].shi[shi.selectedIndex - 1].qu[k].name, city[sheng.selectedIndex - 1].shi[shi.selectedIndex - 1].qu[k].code);
                                }
                            }
                        }
                    }
                }

            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
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
                // console.log(communityList.length);
                for (var i = 0; i < communityList.length; i++) {
                    community.options[i + 1] = new Option(communityList[i].name, communityList[i].id);
                }
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });

    },

    //双击编辑
    ondblclickEditor: function (element, id) {
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
                    url: urlScope + '/',
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
                element.innerHTML = this.value;
            }
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
    },

    //批量删除
    deleSeltedRecords: function () {
        var checkbox = $("table > tbody > tr > td > input[type='checkbox']:checked");
        var checkboxItem = $("table > tbody > tr > td > input[type='checkbox']:checked");
        var ids = "";
        for (var i = 0; i < checkboxItem.length; i++) {
            ids += checkboxItem[i].parentElement.nextSibling.nextSibling.innerText + ",";
        }
        ids = ids.substring(0, ids.length - 1);
        console.log(ids);
        if (ids != "") {
            layer.confirm("确定删除所选记录？", function (index) {
                $.ajax({
                    type: "post",
                    url: urlScope + '/',
                    data: {
                        ids: ids,
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

    //限制上传的file是图片以及图片的大小
    fileType: function (target) {//target为选择器
        var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
        var fileSize = 0;
        var filetypes = [".jpg", ".png", "bmp", "gif", "jpeg"];
        var filepath = target.value;
        var filemaxsize = 1024 * 3;//5M
        if (filepath) {
            var isnext = false;
            var fileend = filepath.substring(filepath.indexOf("."));
            if (filetypes && filetypes.length > 0) {
                for (var i = 0; i < filetypes.length; i++) {
                    if (filetypes[i] == fileend) {
                        isnext = true;
                        break;
                    }
                }
            }
            if (!isnext) {
                alert("您上传的文件不是图片,请重新上传！");
                target.value = "";
                return false;
            }
        } else {
            return false;
        }
        if (isIE && !target.files) {
            var filePath = target.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
            if (!fileSystem.FileExists(filePath)) {
                alert("您上传的图片不存在，请重新输入！");
                return false;
            }
            var file = fileSystem.GetFile(filePath);
            fileSize = file.Size;
        } else {
            fileSize = target.files[0].size;
        }

        var size = fileSize / 1024;
        if (size > filemaxsize) {
            alert("您上传的图片大小不能大于" + filemaxsize / 1024 + "M！");
            target.value = "";
            return false;
        }
        if (size <= 0) {
            alert("您上传的图片大小不能为0M！");
            target.value = "";
            return false;
        }
    },

    //限制file上传的数量
    limitFileCountCheck: function (objForm) {
        var trLength = $('#tbodyId > tr').length;
        var num = 8;//8为页面上最多需要多少条内容
        if (window.File && window.FileList) {
            var fileCount = objForm["carouselFigureImg"].files.length;
            var maxFile = num - trLength;
            if (fileCount + trLength > num) {
                window.alert('页面上只能显示5-8张图片，最多只能选择' + maxFile + '张了');
                document.getElementById('carouselFigureImg').valal = '';
                return;
            }else {
                window.alert('页面上只能显示5-8张图片，你选择了' + fileCount + '张');
                //符合条件后的代码
            }
        }
        else {
            window.alert('抱歉，你的浏览器不支持FileAPI，请升级浏览器！');
        }
        return false;
    },

}
