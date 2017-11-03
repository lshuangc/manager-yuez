var panel = {
    init: function () {
        $("#communityId").val(common.getQueryString("communityid"));
        this.getCommunityType();
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
                        '<td><img  src="' + imgurl + 'communitytype/' + data[i].typeImgurl + '" ></td>' +
                        // '<td >' + data[i].typeDatail + '</td>' +
                        '<td>' + data[i].housetypeName + '</td>' +
                        '<td>' + data[i].typeCommision + '</td>' +
                        '<td >' + data[i].typeArea + '</td>' +
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
