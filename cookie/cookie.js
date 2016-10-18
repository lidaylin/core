var Cookie = {
	get: function(name) {
		var reg = new RegExp("(\;||^)" + name + "\=([^\;]+)(\;||$)", "");
			var cookie = document.cookie; 
			cookie = cookie.match(reg);
			return cookie && cookie[2];
	},
	set : function(key, val, opt) {
		cookie = key + "=" + escape(val);

		if(opt) {
			if(opt.duration) {
				var now = new Date;
				now.setTime(now.getTime() + opt.deration * 86400000);
				cookie += ';expires=' + now.toGMTString();
			};
			cookie += [";",opt.path ? "path=" + opt.path : "", ";", opt.domain ? "domain=" + opt.domain : "", ";", opt.secure ? "secure=" + opt.secure : "", ";"].join("");
		}
		document.cookie = cookie;
	},
	remove : function(key) {
		this.set(key, '', extend({}, {expires : "-1"}));
	}
}

function extend(__super, option) {//扩展对象

	if(typeof __super == "function") {
		__super = _super.prototype;
	}
	var kcall = {};
	kcall.__proto__ = __super;
	kcall.__proto__.__proto__ = option;
	return kcall;
}