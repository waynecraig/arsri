define(function(require, exports) {
	var Event = require('./Event.js'),
		markdowneditor = require('./markdowneditor'),
		dialog = require('./dialog'),
		cacheContact;

	exports.init = function(main) {

		Event.on.call(main, 'nav-changed', function(e) {
			if (e.name == 'contact') {
				renderContact();
			}
		});
	};

	function renderContact() {
		if (cacheContact) {
			setUpEditor(cacheContact);
		} else {
			$.get('/q?collection=meta&condition[id]=contact', function(data) {
				var contact = data[0];
				if (contact) {
					setUpEditor(contact);
					cacheContact = contact;
				}
			});
		}
	}

	function setUpEditor(data) {
		var wrap = $('#arsri-content').empty(),
			form = $('<form class="form-horizontal">').appendTo(wrap),
			fieldset = $('<fieldset>').appendTo(form),
			legend = $('<legend>').html('联系我们').appendTo(fieldset),
			controlGroup = $('<div class="control-group">').appendTo(fieldset);
		markdowneditor.setUp(controlGroup, data.content);
		$('<div class="form-actions"><button type="submit" class="btn btn-primary">保存修改</button><button type="reset" class="btn">重置</button></div>').appendTo(fieldset);

		fieldset.find('button:reset').click(function(e) {
			e.preventDefault();
			markdowneditor.reset();
		});
		fieldset.find('button:submit').click(function(e) {
			e.preventDefault();
			var modified = fieldset.find('.info');
			if (modified.size() > 0) {
				dialog.showModifiedConfirm('联系我们', modified.size(), updateData, function() {
					fieldset.find('button:reset').click();
				});
			}

			function updateData() {
				var data = {
					_id: cacheContact._id,
					content: markdowneditor.getNewValue()
				};
				$.post('/admin/s', {
					collection: 'meta',
					data: data
				}, function(data) {
					cacheContact = null;
					renderContact();
				}).fail(function(e) {
					dialog.showMessage('保存失败！');
				});
			}
		});
	}
});