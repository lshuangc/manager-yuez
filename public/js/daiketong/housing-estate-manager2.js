'use strict';
var panel = {
    init: function () {
        common.bind_Sanji();
        this.housingPagIng2();
    },

    housingPagIng2: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Community/findByScreen',
            dataType: 'json',
            data: {
                page: curr || 1,
                rows: 10,
                type:1
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
                            panel.housingPagIng2(obj.curr);
                        }
                    }
                });
            },
            error: function (data) {
                layer.msg('网络错误', {icon: 1, time: 1000});
            }
        });
    },

    ShowElementName: function (element,id) {
        var oldhtml = element.innerHTML;
        var newobj = document.createElement('input');
        newobj.type = 'text';
        newobj.value = oldhtml;
        newobj.onblur = function () {
            $.ajax({
                type: 'POST',
                url: urlScope + '/Community/updateCommuity',
                data: {
                    id: id,
                    name: $(this).val()
                },
                dataType: 'json',
                success: function (data) {
                    panel.housingPagIng2;
                }
            });
            //当触发时判断新增元素值是否为空，为空则不修改，并返回原有值
            element.innerHTML = this.value ? this.value : oldhtml;
            element.setAttribute("ondblclick", "ondblclickEditor(this);");
        }
        element.innerHTML = '';
        element.appendChild(newobj);
        newobj.setSelectionRange(0, oldhtml.length);
        newobj.focus();
        newobj.parentNode.setAttribute("ondblclick", "");
    },

    house_search: function (curr) {
        $.ajax({
            type: 'POST',
            url: urlScope + '/Community/findByScreen',
            data: {
                page: curr || 1,
                rows: 10,
                startTime: $("#datemin").val(),
                endTime: $("#datemax").val(),
                name: $("#housingName").val(),
                provinceCode: $("#sheng").val(),
                cityCode: $("#shi").val(),
                countyCode: $("#qu").val(),
                housetypeId: $("#housingId").val(),
                type:1
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
                            panel.house_search(obj.curr);
                        }
                    }
                });

            },
            error: function (data) {
                layer.msg('网络错误!', {icon: 1, time: 1000});
            },
        });
    },

    housing_add: function (title, url, w, h) {
        layer_show(title, url, w, h);
    },

    housing_edit: function (title, url, id, w, h) {
        layer_show(title, url, w, h);
    },

    revise: function (title, url, id, w, h) {
        layer_show(title, url, w, h);
    },

    lunbotu_edit: function (title, url, id, w, h) {
        layer_show(title, url, w, h);
    },

    packQueryData: function (data) {
        if (data.result != '1') {
            layer.msg('获取数据失败', {icon: 1, time: 1000});
            return;
        }

        var w = data.object;
        var data = w.data;
        var tag = '';
        for (var i = 0; i < data.length; i++) {
            tag += '<tr class="text-c">' +
                '<td>' + (i + 1) + '</td>' +
                '<td><img src="' + imgurl + 'community/' + data[i].imgUrl + '" ></td>' +
                '<td class="td-manage">' +
                '<a href="javascript:;" onclick=panel.lunbotu_edit("预览","lunbotu-check.html?configId='+data[i].id +'","1","1000","700") class="label-success  radius label">预览</a>'+
                '</td>' +
                '<td ondblclick="panel.ShowElementName(this,' + data[i].id + ')">' + data[i].name + '</td>' +
                '<td>' + data[i].provinceName + ',' + data[i].cityName + ',' + data[i].countyName + '</td>' +
                '<td>' + data[i].address + '</td>' +
                // '<td>' + data[i].coordinate + '</td>' +
                '<td>' + data[i].houseTypeRange + '</td>' +
                '<td>' + data[i].houseProportionRange + '</td>' +
                '<td>' + data[i].propertyName + '</td>' +
                '<td>' + data[i].devloper + '</td>' +
                '<td>' + data[i].sellerCommpanyName + '</td>' +
                '<td>' + common.dateFormat(data[i].communityAddtime.time) + '</td>' +
                '<td class="td-manage">' +
                '<a href="javascript:;" onclick=panel.housing_edit("户型佣金管理","house_type_manager.html?communityid='+data[i].id +'","1","1000","700") class="label-success  radius label">查看</a>'+
                '</td>' +
                '<td class="td-manage">' +
                '<a href="javascript:;" onclick=panel.revise("修改","housing-estate-manager_revise.html?reviseid='+data[i].id +'","1","1000","700") class="label-success  radius label">修改</a>'+
                '</td>' +
                '</tr>';
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
        // if(type==2){
        //     $("td:last-child").hide();
        // }

    },


}

$(function () {
    panel.init();

    $(".aclick").click(function() {
        $(this).addClass('btn-primary').siblings().removeClass('btn-primary');
    });

    $("a:nth-child(2)").click(function () {
        $("#xiangmu").hide();
        $("th:last-child").hide();
        $("td:last-child").hide();
    });
    
    $("a:nth-child(1)").click(function () {
        $("#xiangmu").show();
        $("tr th:last-child").show();
    });

});