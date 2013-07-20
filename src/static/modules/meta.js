define(function(require, exports) {
	require('jquery');

	exports.init = function() {
		$.get('/q', function (data) {
			var m = data[0];
			$('head > title').html(m.title);
			$('#heading').html(m.heading);
			$('#nav').html('');
			for (var i = 0; i < m.nav.length; i++) {
				var navitem = $('<li><a>' + m.nav[i].text + '</a></li>');
				if (i === 0) {
					navitem.addClass('active');
				}
				$('#nav').append(navitem);
			}
			$('#copyright').html(m.copyright);
		});
	};

});