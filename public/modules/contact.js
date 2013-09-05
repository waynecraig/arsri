
define(function(require, exports) {
	require('jquery');
	require('/lib/showdown/showdown');
	var Event = require('./Event.js'),
		cacheContact;
	
	exports.init = function(main) {
		Event.on.call(main, 'nav-changed', function (e) {
			if (e.name == 'contact') {
				renderContact();
			}
		});
	};

	function renderContact () {
		if (cacheContact) {
			$('<div class="arsri-contact container">').html(cacheContact.content).appendTo($('#arsri-content').html(''));
		} else {
			$.get('/q?collection=meta&condition[id]=contact', function (data) {
				var contact = data[0],
					converter = new Showdown.converter();
				contact.content = converter.makeHtml(contact.content);
				if (contact) {
					$('<div class="arsri-contact container">').html(contact.content).appendTo($('#arsri-content').html(''));
					cacheContact = contact;
				}
			});
		}
	}
});