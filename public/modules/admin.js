define(function(require, exports, module) {
	var Event = require('./Event'),
		dialog = require('./dialog'),
		cacheUser,
		cacheMeta;

	exports.init = function() {
		setUpHeader();
		setUpHome();
		setUpModules();
	};

	function setUpHeader() {
		$.post('/getProfile', function(user) {
			$('head > title').html('后台管理系统');
			var wrap = $("<div class='navbar-inner'>").appendTo($('#arsri-header').html('')),
				title = $("<a class='arsri-brand'>后台管理系统</a>").appendTo(wrap),
				nav = $("<ul class='nav navbar-nav pull-right'>").appendTo(wrap);
			if (user) {
				nav.html("<li><a href='profile'>" + user.displayName + "</a></li><li><a href='/logout'>退出</a></li>");
				nav.delegate('li>a[href="profile"]', 'click', function(e) {
					e.preventDefault();
					if ($('#arsri-sidebar').find('.active').size() > 0) {
						navChangeFilter(function() {
							Event.emit.call(exports, 'profile', {
								user: user
							});
						});
					}
				});
				cacheUser = user;
			}
		});
	}

	function setUpHome() {
		$.get('/q?collection=meta&condition[id]=site', function(data) {
			var m = data[0];
			if (m.nav) setUpSidebar(m.nav);
			setUpContent(m);
			setUpFooter(m.copyright);
		});
	}

	function setUpSidebar(nav) {
		var wrap = $('<ul class="nav nav-pills nav-stacked">')
			.appendTo($('#arsri-sidebar').html(''));
		for (var i = 0; i < nav.length; i++) {
			var item = $('<li>').appendTo(wrap),
				a = $('<a>').appendTo(item);
			if (nav[i].text) a.html(nav[i].text);
			if (nav[i].name) a.attr('href', nav[i].name);
		}
		var current = wrap.find('li:first-child').addClass('active');
		wrap.delegate('li>a', 'click', function(e) {
			e.preventDefault();
			if (!$(this).offsetParent().hasClass('active')) {
				var self = $(this);
				navChangeFilter(function() {
					var name = self.attr('href');
					if (name) {
						current.removeClass('active');
						current = self.parents('li');
						current.addClass('active');
						Event.emit.call(exports, 'nav-changed', {
							name: name
						});
					}
				});
			}
		});
		Event.on.call(exports, 'profile', function(e) {
			current.removeClass('active');
		});
	}

	function navChangeFilter(callback) {
		if ($('#arsri-content').find('.info').size() > 0) {
			dialog.showForwardConfirm(callback);
		} else {
			callback();
		}
	}

	function setUpContent(meta) {
		cacheMeta = meta;
		renderContent();
		Event.on.call(exports, 'nav-changed', function(e) {
			if (e.name == 'home') {
				renderContent();
			}
		});
	}

	function renderContent() {
		if (cacheMeta) {
			var wrap = $('#arsri-content').empty(),
				form = $('<form class="form-horizontal">').appendTo(wrap),
				fieldset = $('<fieldset>').appendTo(form),
				legend = $('<legend>').html('网站基本信息设置').appendTo(fieldset),
				controlGroup = '<div class="control-group"><label class="control-label" for="{id}">{label}</label>' +
					'<div class="controls"><input type="text" class="input-xxlarge" id="{id}" value="{value}"/></div></div>',
				labelMap = {
					title: '网站名称',
					heading: '首页标题',
					subheading: '首页副标题',
					logo: '网站logo',
					copyright: '版权标识'
				}, i;
			for (i in labelMap) {
				$(controlGroup.replace(/{id}/g, i).replace(/{label}/g, labelMap[i]).replace(/{value}/g, cacheMeta[i])).appendTo(fieldset);
			}

			for (i = 0; i < cacheMeta.nav.length; i++) {
				$('<div class="control-group"><label class="control-label" for="nav_' + i + '">菜单第' + (i + 1) + '项</label>' +
					'<div class="controls"><input type="text" class="input-large" id="nav_' + i + '" value="' + cacheMeta.nav[i].text +
					'"/><span class="help-inline">' + cacheMeta.nav[i].name + '</span></div>').appendTo(fieldset);
			}

			$('<div class="form-actions"><button type="submit" class="btn btn-primary">保存修改</button><button type="reset" class="btn">重置</button></div>').appendTo(fieldset);

			var inputs = fieldset.find('input');
			inputs.each(function() {
				$(this).attr('originalValue', $(this).val());
			});
			inputs.change(function() {
				if ($(this).val() != $(this).attr('originalValue')) {
					$(this).parents('.control-group').addClass('info');
				} else {
					$(this).parents('.control-group').removeClass('info');
				}
			});
			fieldset.find('button:reset').click(function() {
				fieldset.find('.control-group').removeClass('info');
			});
			fieldset.find('button:submit').click(function(e) {
				e.preventDefault();
				var modified = fieldset.find('.info');
				if (modified.size() > 0) {
					dialog.showModifiedConfirm('网站基本信息设置', modified.size(), updateData, function() {
						fieldset.find('button:reset').click();
					});
				}

				function updateData() {
					var data = {
						_id: cacheMeta._id
					};
					modified.each(function() {
						var input = $(this).find('input');
						if (input.size() == 1) {
							var key = input.attr('id');
							if (key.match(/nav_/)) {
								if (!data.nav) data.nav = cacheMeta.nav;
								data.nav[parseInt(key.replace(/nav_/, ''))].text = input.val();
							} else {
								data[key] = input.val();
							}
						}
					});
					$.post('/admin/s', {
						collection: 'meta',
						data: data
					}, function(data) {
						location.reload();
					}).fail(function(e) {
						dialog.showMessage('保存失败！');
					});
				}
			});
		}
	}

	function setUpFooter(copyright) {
		var footer = $('#arsri-footer'),
			wrap = $('<div class="container">');
		wrap.html(copyright).appendTo(footer);
	}

	function setUpModules() {
		var intro = require('./intro_admin'),
			price = require('./price_admin'),
			contact = require('./contact_admin'),
			products = require('./products_admin');
		intro.init(exports);
		products.init(exports);
		price.init(exports);
		contact.init(exports);
	}
});