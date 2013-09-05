define(function(require, exports) {
	var Event = require('./Event.js'),
		markdowneditor = require('./markdowneditor'),
		dialog = require('./dialog'),
		cacheProducts = {};

	exports.init = function(main) {

		Event.on.call(main, 'nav-changed', function(e) {
			if (e.name == 'products') {
				renderIndex();
			}
		});
	};

	function renderIndex() {
		if (cacheProducts.index) {
			setUpList(cacheProducts.index);
		} else {
			$.get('/q?collection=products&fields[id]=true&fields[name]=true', function(data) {
				data.sort(function(a, b) {
					return parseInt(a.id.replace('product_', '')) - parseInt(b.id.replace('product_', ''));
				});
				setUpList(data);
				cacheProducts.index = data;
			});
		}
	}

	function renderProduct(id) {
		if (cacheProducts[id]) {
			setUpEditor(cacheProducts[id]);
		} else {
			$.get('/q?collection=products&condition[id]=' + id, function(data) {
				var product = data[0];
				setUpEditor(product);
				cacheProducts[id] = product;
			});
		}
	}

	function setUpList(data) {
		var wrap = $('#arsri-content').empty(),
			form = $('<form class="form-horizontal">').appendTo(wrap),
			fieldset = $('<fieldset>').appendTo(form),
			legend = $('<legend>').html('产品列表').appendTo(fieldset),
			controlGroup = $('<div class="control-group">').appendTo(fieldset);
		ul = $('<ul>').appendTo(controlGroup);
		for (var i = 0; i < data.length; i++) {
			$('<li>').append($('<a href="' + data[i].id + '">' + data[i].name + '</a>')).appendTo(ul);
		}
		ul.delegate('li > a', 'click', function(e) {
			e.preventDefault();
			renderProduct($(this).attr('href'));
		});
	}

	function setUpEditor(data) {
		var wrap = $('#arsri-content').empty(),
			form = $('<form class="form-horizontal">').appendTo(wrap),
			fieldset = $('<fieldset>').appendTo(form),
			legend = $('<legend>').html('产品详情').appendTo(fieldset),
			name = $('<div class="control-group"><input type="text" class="input-xxlarge" id="productName" value="' +
				data.name + '"/></div>').appendTo(fieldset),
			controlGroup = $('<div class="control-group">').appendTo(fieldset);
		markdowneditor.setUp(controlGroup, data.content);
		$('<div class="form-actions"><button type="submit" class="btn btn-primary">保存修改</button><button type="reset" class="btn">重置</button></div>').appendTo(fieldset);

		name.find('input').each(function() {
			$(this).attr('originalValue', $(this).val());
		}).change(function() {
			if ($(this).val() != $(this).attr('originalValue')) {
				$(this).parents('.control-group').addClass('info');
			} else {
				$(this).parents('.control-group').removeClass('info');
			}
		});
		fieldset.find('button:reset').click(function(e) {
			e.preventDefault();
			name.find('input').each(function() {
				$(this).val($(this).attr('originalValue'));
			}).change();
			markdowneditor.reset();
		});
		fieldset.find('button:submit').click(function(e) {
			e.preventDefault();
			var modified = fieldset.find('.info');
			if (modified.size() > 0) {
				dialog.showModifiedConfirm('产品详情', modified.size(), updateData, function() {
					fieldset.find('button:reset').click();
				});
			}

			function updateData() {
				var commit = {
					_id: data._id,
					name: name.find('input').val(),
					content: markdowneditor.getNewValue()
				};
				$.post('/admin/s', {
					collection: 'products',
					data: commit
				}, function() {
					cacheProducts[data.id] = null;
					cacheProducts.index = null;
					renderProduct(data.id);
				}).fail(function(e) {
					dialog.showMessage('保存失败！');
				});
			}
		});
		$('<button class="pull-right btn btn-danger">返回列表</button>').appendTo(legend).click(function(e) {
			e.preventDefault();
			$('#arsri-sidebar').find('li.active').find('a').click();
		})
	}
});