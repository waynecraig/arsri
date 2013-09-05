define(function(require, exports, module) {
	require('jquery');
	var Event = require('./Event.js'),
		cacheMeta;

	exports.init = function() {
		$.get('/q?collection=meta&condition[id]=site', function(data) {
			var m = data[0];
			$('head > title').html(m.title);
			if (m.nav) setUpHeader(m.nav);
			setUpContent(m);
			setUpFooter(m.copyright);

			setUpModules();
		});
	};

	function setUpHeader(navData) {
		var header = $('#arsri-header').addClass('navbar navbar-inverse navbar-fixed-top'),
			navbar = $('<div class="navbar-inner">').appendTo(header),
			container = $('<div class="container">').appendTo(navbar),
			wrap = $('<div>').appendTo(container), 
			nav = $('<ul class="nav">').appendTo(wrap);
		for (var i = 0; i < navData.length; i++) {
			var item = $('<li>').appendTo(nav),
				a = $('<a>').appendTo(item);
			if (navData[i].text) a.html(navData[i].text);
			if (navData[i].name) a.attr('href', navData[i].name);
		}

		var current = wrap.find('ul.nav>li:first-child').addClass('active');
		wrap.delegate('li>a', 'click', function(e) {
			e.preventDefault();
			if (!$(this).offsetParent().hasClass('active')) {
				var name = $(this).attr('href');
				if (name) {
					current.removeClass('active');
					current = $(this).parents('li');
					current.addClass('active');
					Event.emit.call(exports, 'nav-changed', {
						name: name
					});
				}
			}
		});
	}

	function setUpContent(meta) {
		$('#arsri-content').addClass('arsri-headline');
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
			var content = $('#arsri-content').html('');
			var wrap = $('<h1 class="arsri-logo">'),
				logo = $('<div class="logo">'),
				subheading = $('<small>' + cacheMeta.subheading + '</small>');
			logo.css('background-image', 'url(' + cacheMeta.logo + ')');
			wrap.append(logo).append(cacheMeta.heading).append(subheading).appendTo(content);
		}
	}

	function setUpFooter(copyright) {
		var footer = $('#arsri-footer'),
			wrap = $('<div class="container">');
		wrap.html(copyright).appendTo(footer);
	}

	function setUpModules() {
		var intro = require('./intro'),
			products = require('./products'),
			price = require('./price'),
			contact = require('./contact');
		intro.init(exports);
		products.init(exports);
		price.init(exports);
		contact.init(exports);
	}
});