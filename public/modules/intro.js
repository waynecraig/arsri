
define(function(require, exports) {
	require('jquery');
	require('/lib/showdown/showdown');
	var Event = require('./Event.js'),
		cacheIntro;
	
	exports.init = function(main) {
		Event.on.call(main, 'nav-changed', function (e) {
			if (e.name == 'intro') {
				renderIntro();
			}
		});
	};

	function renderIntro () {
		if (cacheIntro) {
			$('<div class="arsri-intro container">').html(cacheIntro.content).appendTo($('#arsri-content').html(''));
		} else {
			$.get('/q?collection=meta&condition[id]=intro', function (data) {
				var intro = data[0],
					converter = new Showdown.converter();
				intro.content = converter.makeHtml(intro.content);
				if (intro) {
					$('<div class="arsri-intro container">').html(intro.content).appendTo($('#arsri-content').html(''));
					cacheIntro = intro;
				}
			});
		}
	}
});