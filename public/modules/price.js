
define(function(require, exports) {
	require('jquery');
	require('/lib/showdown/showdown');
	var Event = require('./Event.js'),
		cachePrice;
	
	exports.init = function(main) {
		Event.on.call(main, 'nav-changed', function (e) {
			if (e.name == 'price') {
				renderPrice();
			}
		});
	};

	function renderPrice () {
		if (cachePrice) {
			$('<div class="arsri-price container">').html(cachePrice.content).appendTo($('#arsri-content').html(''));
		} else {
			$.get('/q?collection=meta&condition[id]=price', function (data) {
				var price = data[0],
					converter = new Showdown.converter();
				price.content = converter.makeHtml(price.content);
				if (price) {
					$('<div class="arsri-price container">').html(price.content).appendTo($('#arsri-content').html(''));
					cachePrice = price;
				}
			});
		}
	}
});