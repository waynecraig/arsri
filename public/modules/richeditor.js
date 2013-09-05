define(function(require, exports) {
	require('bootstrap');
	require('wysiwyg');

	exports.setUp = function(content) {
		getToolbar().insertBefore(content);
		content.attr('id', 'editor').wysiwyg();
	};

	function getToolbar () {
		var toolbar = $('<div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">'),
			font = $('<div class="btn-group"><a class="btn dropdown-toggle" data-toggle="dropdown" title="" ' + 
				'data-original-title="Font"><i class="icon-font"></i><b class="caret"></b></a></div>').appendTo(toolbar),
			fontList = ['Serif', 'Sans', 'Arial'],
			fontUl = $('<ul class="dropdown-menu">').appendTo(font),
			i;
		for (i = 0; i < fontList.length; i++) {
			$('<li><a data-edit="fontName ' + fontList[i] + '" style="font-family:&#39;' + fontList[i] + '&#39;">' + fontList[i] + '</a></li>').appendTo(fontUl);
		}
		return toolbar;
	}

	function renderIntro() {
		var container = $('#arsri-content').empty(),
			toolbar = $('<div class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">')
				.html('<a class="btn btn-primary" data-edit="bold"><i class="icon-align-left"></i></a></div>')
				.appendTo(container);
			
		if (cacheIntro) {
			$('<div class="arsri-intro" id="editor">').html(cacheIntro.content).appendTo(container).wysiwyg();
		} else {
			$.get('/q?collection=meta&condition[id]=intro', function (data) {
				var intro = data[0];
				if (intro) {
					$('<div class="arsri-intro" id="editor">').html(intro.content).appendTo(container).wysiwyg();
					cacheIntro = intro;
				}
			});
		}
	}
});