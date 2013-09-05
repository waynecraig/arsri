define(function(require, exports) {
	require('jquery');
	require('/lib/showdown/showdown');
	var Event = require('./Event.js'),
		cacheProducts = {};

	exports.init = function(main) {
		setUpSubMenu();
		Event.on.call(main, 'nav-changed', function(e) {
			if (e.name.match('product')) {
				renderProduct(e.name);
			}
		});
	};

	function setUpSubMenu() {
		$.get('/q?collection=products&fields[id]=true&fields[name]=true', function(data) {
			data.sort(function (a, b) {
				return parseInt(a.id.replace('product_', '')) - parseInt(b.id.replace('product_', ''));
			});
			var parent = $('#arsri-header>').find('a[href="products"]').offsetParent();
			if (parent) {
				var nav = $('<ul class="arsri-product-menu">').appendTo(parent);
				for (var i = 0; i < data.length; i++) {
					var item = $('<li>').appendTo(nav),
						a = $('<a>').appendTo(item);
					if (data[i].name) a.html(data[i].name);
					if (data[i].id) a.attr('href', data[i].id);
				}
				parent.find('a[href="products"]').attr('href', '');
			}
		});
	}

	function renderProduct(name) {
		if (cacheProducts[name]) {
			$('<div class="arsri-product container">').html(cacheProducts[name].content).appendTo($('#arsri-content').html(''));
		} else {
			$.get('/q?collection=products&condition[id]=' + name, function(data) {
				var p = data[0],
					converter = new Showdown.converter();
				p.content = converter.makeHtml(p.content);
				if (p) {
					$('<div class="arsri-product container">').html(p.content).appendTo($('#arsri-content').html(''));
					cacheProducts[name] = p;
				}
			});
		}
	}
});