var SERVER_IP = 'eternalzzx.site';
$(function(){
	$(window).scroll(function(){
		if ($(window).scrollTop() >= 105) {
			$("div.fix-header").addClass("show-header");
		} else {
			$("div.fix-header").removeClass("show-header");
		}
	});

    $("a.to-top").click(function(event) {
        $("html,body").animate({scrollTop: $("#header").offset().top}, 700);
    });

    $("#registe-btn").click(function(event) {
        var btn = $(this);
        if(!btn.hasClass('disable')){
            var mcnick = $("#mcnick-input").val(),
                code = $("#code-input").val();
            if (mcnick == "") {
                x0p('提示', '未填写游戏用户名!', 'info', false);
                return;
            } 
            var reg = /^[A-Za-z0-9_]{3,16}$/;
            if (!reg.test(mcnick)) {
                x0p('提示', '不是合法的MC正版用户名!', 'error', false);
                return;
            }
            if (code == "") {
                x0p('提示', '未填写邀请码!', 'info', false);
                return;
            }
            reg = /^[A-Za-z0-9\-]{20,24}$/;
            if (!reg.test(code)) {
                x0p('提示', '邀请码格式错误!', 'error', false);
                return;
            }
            openloading();
            btn.addClass('disable');
            $(this).parents(".flip-container").addClass('load');
            var count = 10;
            var interval = setInterval(function(){
                count--;
                $('#count-btn').html(count);
                if (count <= 0) {
                    btn.removeClass('disable');
                    clearInterval(interval);
                    $('#count-btn').parents(".flip-container").removeClass('load');
                    setTimeout("$('#count-btn').html('10')", 600);
                }
            }, 1000);
            $.post("/command/addwhitelist",
                {
                    mcnick: mcnick,
                    code: code
                },
                function (data, status) {
                    closeloading();
                    if (status == "success") {
                        if (data == "-1") {
							x0p('网站故障', '服务故障请稍后再试!', 'error', false);
						} else if (data == "0") {
                            x0p('提示', mcnick + ' 在白名单中已存在!', 'info', false);
                        } else if (data == "1") {
                            x0p('注册成功', '已添加 ' + mcnick + ' 到白名单!\n请登录服务器 IP: ' + SERVER_IP, 'ok', false);
                            $("#mcnick-input").val("");
                            $("#code-input").val("");
                        } else if (data == "2") {
                            x0p('注册失败', '该邀请码已被使用!', 'error', false);
                        } else if (data == "3") {
                            x0p('注册失败', '邀请码输入错误!', 'error', false);
                        } else if (data == "4") {
                            x0p('注册失败', '请确保用户名为正版游戏昵称，Mojang网络延迟或导致添加失败，请稍后再试或联系服主!', 'error', false);
                        } else {
							x0p('注册失败', '请勿使用非法字符!', 'error', false);
						}
                    } else {
                        x0p('网站故障', '服务故障请稍后再试!', 'error', false);
                    }
            });
        }
    });

    $("#get-code").click(function(event) {
        var btn = $(this).children('.btn-table'),
            progress = $(this).children('.btn-progress');
        if(!btn.hasClass('disable')){
            openloading();
            btn.addClass('disable');
            progress.addClass('active');
            setTimeout(function(){
                progress.removeClass('active');
                btn.removeClass('disable');
            }, 10000);
            $.get("/command/getcode",
                function (data, status) {
                    closeloading();
                    if (status == "success") {
                        if (data.status == "-1") {
							x0p('网站故障', '服务故障请稍后再试!', 'error', false);
						} else if (data.status == "0") {
                            x0p('获取失败', '邀请码已被领取完！', 'error', false);
                        } else if (data.status == "1") {
							var codeInput = $("#code-input");
                            codeInput.val(data.code);
							//codeInput.focus().select();
                            //document.execCommand("copy", false, null);
                            //codeInput.blur();
							x0p('邀请码', data.code + '\n请妥善保存邀请码', 'ok', false);
                        } else {
                            x0p('获取失败', '今日您已领取邀请码', 'error', false);
                        }
                    } else {
                        x0p('网站故障', '服务故障请稍后再试!', 'error', false);
                    }
            });
        }
    });

    $("#submit-btn").click(function(event) {
        var btn = $(this),
            textarea = $("#suggestion-textarea");
        if(!btn.hasClass('disable') && textarea.val() != "") {
            openloading();
            btn.addClass('disable');
            setTimeout(function(){
                btn.removeClass('disable');
            }, 10000);
            $.post('/command/suggestion', 
                {
                    suggestion: textarea.val()
                }, 
                function (data, status) {
                    closeloading();
                    if (status == "success" && data == "0") {
                        textarea.val("");
                        x0p('提示', '您的建议已收到，感谢您的留言！', 'ok', false);
                    } else {
                        x0p('网站故障', '服务故障请稍后再试!', 'error', false);
                    }
            });
        }
    });

    console.log("%c欢迎各位前后台高手提出建议 QQ:1301340187", "color: #ddd");
});