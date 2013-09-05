define(function(require, exports) {
	require('bootstrap');
	require('/lib/showdown/showdown');


	exports.setUp = function(container, markdown) {
		var converter = new Showdown.converter();

		var tabs = $('<div class="tabbable tabs-right">').appendTo(container),
			tabNav = $('<ul class="nav nav-tabs"><li class="active">' +
				'<a href="#tab1" data-toggle="tab">编辑</a></li>' +
				'<li><a href="#tab2" data-toggle="tab">预览</a></li></ul>').appendTo(tabs),
			tabContent = $('<div class="tab-content">').appendTo(tabs),
			tabEditor = $('<div class="tab-pane active" id="tab1">').appendTo(tabContent),
			tabPreview = $('<div class="tab-pane" id="tab2">').appendTo(tabContent),
			editor = $('<textarea class="span9" style="min-height:300px;">').val(markdown).appendTo(tabEditor),
			preview = $('<div>').html(converter.makeHtml(markdown)).appendTo(tabPreview);

		editor.change(function () {
			preview.html(converter.makeHtml(editor.val()));
			if (editor.val() != markdown) {
				container.addClass('info');
			} else {
				container.removeClass('info');
			}
		});

		this.reset = function () {
			editor.val(markdown).change();
		};

		this.getNewValue = function () {
			return editor.val();
		};
	};


});