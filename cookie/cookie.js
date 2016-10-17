var Cookie = {
	get: function(name) {
		var reg = new RegExp("(\;||^)" + name + "\=([^\;]+)(\;||$)", "");
			var cookie = document.cookie; 
			cookie = cookie.match(reg);
			return cookie && cookie[2];
	},
	set : function(name, val, opt) {
		cookie = name + escape(value);

		if(opt) {
			if(opt.duration) {
				var now = new Date;
				noe.setDate(now.getSeconds() + opt.detation);
				cookie += ';expires=' + now.toGMTString();
			};
			cookie += [";",opt.path ? "path=" + opt.path : "", ";", opt.domain ? "domain=" + opt.domain : "", ";", opt.secure ? "secure=" + opt.secure : "", ";"].join();
		}
		document.cookie = cookie;
	}
}