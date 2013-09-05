define(function(require, exports) {
	var Event = require('./Event.js'),
		markdowneditor = require('./markdowneditor'),
		dialog = require('./dialog'),
		cachePrice;

	exports.init = function(main) {

		Event.on.call(main, 'nav-changed', function(e) {
			if (e.name == 'price') {
				renderPrice();
			}
		});
	};

	function renderPrice() {
		if (cachePrice) {
			setUpEditor(cachePrice);
		} else {
			$.get('/q?collection=meta&condition[id]=price', function(data) {
				var price = data[0];
				if (price) {
					setUpEditor(price);
					cachePrice = price;
				}
			});
		}
	}

	function setUpEditor(data) {
		var wrap = $('#arsri-content').empty(),
			form = $('<form class="form-horizontal">').appendTo(wrap),
			fieldset = $('<fieldset>').appendTo(form),
			legend = $('<legend>').html('获奖情况').appendTo(fieldset),
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
				dialog.showModifiedConfirm('获奖情况', modified.size(), updateData, function() {
					fieldset.find('button:reset').click();
				});
			}

			function updateData() {
				var data = {
					_id: cachePrice._id,
					content: markdowneditor.getNewValue()
				};
				$.post('/admin/s', {
					collection: 'meta',
					data: data
				}, function(data) {
					cachePrice = null;
					renderPrice();
				}).fail(function(e) {
					dialog.showMessage('保存失败！');
				});
			}
		});
	}
});