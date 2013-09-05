define(function(require, exports) {

	function has_events (type) {
		var events = this._events;
		return events && (type in events) && (events[type].length > 0);
	}

	return {

		on: function(type, fn, context, once) {
			var events = this._events = this._events || {};
			events[type] = events[type] || [];
			events[type].push({
				fn: fn, //回调函数
				context: context || this, //上下文
				once: once
			});
		},

		has_events: has_events,

		off: function(type, fn, context) {
			if (!has_events.call(this, type)) {
				return this;
			}
			var events = this._events;
			for (var i = 0; i < events[type].length; i++) {
				if ((events[type][i].fn === fn) && (!context || (events[type][i].context === context))) {
					events[type].splice(i, 1);
					return this; //返回链对象
				}
			}
		},

		emit: function(type, data) {
			if (!has_events.call(this, type)) {
				return this;
			}
			//获取当前事件类型所有注册事件
			var listeners = [].concat(this._events[type]);
			for (var i = 0; i < listeners.length; i++) {
				if (!listeners[i].fn) {
					continue;
				}
				listeners[i].fn.call(listeners[i].context || this, data);
				if (listeners[i].once) this._events[type].splice(i, 1);
			}
		},

		clear_events: function(type) {
			if (type) {
				if (this._events[type]) {
					this._events[type] = null;
				}
			} else {
				this._events = null;
			}
		}

	};
});