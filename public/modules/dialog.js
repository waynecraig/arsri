define(function(require, exports, module) {
	require('bootstrap');

	exports.showModifiedConfirm = function(name, count, saveCallback, discardCallback) {
		var dialog = $('<div class="modal hide fade">').append(
			$('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" ' +
				'aria-hidden="true">&times;</button><h3>提示</h3></div>')).append(
			$('<div class="modal-body">').html('<p>您在' + name + '中做了' + count + '项修改，是否要保存？</p>'))
			.modal('show').on('hidden', function() {
				dialog.remove();
			}),
			footer = $('<div class="modal-footer">').appendTo(dialog),
			save = $('<a href="#" class="btn btn-primary">保存</a>').click(function(e) {
				e.preventDefault();
				saveCallback();
				dialog.modal('hide');
			}).appendTo(footer),
			discard = $('<a href="#" class="btn">不保存</a>').click(function(e) {
				e.preventDefault();
				discardCallback();
				dialog.modal('hide');
			}).appendTo(footer),
			cancel = $('<a href="#" class="btn">返回</a>').click(function(e) {
				e.preventDefault();
				dialog.modal('hide');
			}).appendTo(footer);
	};

	exports.showForwardConfirm = function(callback) {
		var dialog = $('<div class="modal hide fade">').append(
			$('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" ' +
				'aria-hidden="true">&times;</button><h3>提示</h3></div>')).append(
			$('<div class="modal-body">').html('<p>您当前页面中有未保存的修改，本次操作会使这些修改丢失，确认继续？</p>'))
			.modal('show').on('hidden', function() {
				dialog.remove();
			}),
			footer = $('<div class="modal-footer">').appendTo(dialog),
			forward = $('<a href="#" class="btn btn-primary">继续</a>').click(function(e) {
				e.preventDefault();
				callback();
				dialog.modal('hide');
			}).appendTo(footer),
			cancel = $('<a href="#" class="btn">返回</a>').click(function(e) {
				e.preventDefault();
				dialog.modal('hide');
			}).appendTo(footer);
	};

	exports.showMessage = function(msg) {
		var dialog = $('<div class="modal hide fade">').append(
			$('<div class="modal-header"><button type="button" class="close" data-dismiss="modal" ' +
				'aria-hidden="true">&times;</button><h3>提示</h3></div>')).append(
			$('<div class="modal-body">').html('<p>' + msg + '</p>'))
			.modal('show').on('hidden', function() {
				dialog.remove();
			}),
			footer = $('<div class="modal-footer">').appendTo(dialog),
			ok = $('<a href="#" class="btn btn-primary">确认</a>').click(function(e) {
				e.preventDefault();
				dialog.modal('hide');
			}).appendTo(footer);
	};

});