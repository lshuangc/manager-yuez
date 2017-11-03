$(function() {
				$('.skin-minimal input').iCheck({
					checkboxClass: 'icheckbox-blue',
					radioClass: 'iradio-blue',
					increaseArea: '20%'
				});

				$("#form-admin-add").validate({
					rules: {
						adminName: {
							required: true,
							minlength: 2,
							maxlength: 16
						},
						password: {
							required: true,
						},
						password2: {
							required: true,
							equalTo: "#password"
						},
						sex: {
							required: true,
						},

						phone: {
							required: true,
							isPhone: true,
						},
						email: {
							required: true,
							email: true,
						},
						adminRole: {
							required: true,
						},
					},
					onkeyup: false,
					focusCleanup: true,
					success: "valid",
					submitHandler: function(form) {
						$(form).ajaxSubmit({
							type: 'post',
							url: urlScope + "/admin/addAdmin",
							success: function(data) {
                    			var data = JSON.parse(data);
                    			if (data.result=='1'){
                                    layer.msg('添加成功!', { icon: 1, time: 1000 });
                                    var index = parent.layer.getFrameIndex(window.name);
                                    parent.$('.btn btn-success radius r').click();
                                    parent.layer.close(index);
								}else {
                                    layer.msg('添加失败！', { icon: 1, time: 1000 });
								}
							},
							error: function(XmlHttpRequest, textStatus, errorThrown) {
								layer.msg('网络错误!', { icon: 1, time: 1000 });
							}
						});

					}
				});
			});