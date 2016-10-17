var localhost = {
	hName          : location.hostname ? location.hostname : 'localstatus',
	isLocalStorage : window.localStorage ? true : false,
	domData        : null,

	initData : function() {
		try{
			this.domData = document.createElement('input');
			this.domData.type = 'hidden';
			this.domData.style.display = 'none';
			this.domData.addHavior('#default#userData');
			document.body.appendChild(this.domData);
			var now = new Date();
			now.setTime(now.getTime() + 360);
			this.domData.expires = now.toGMTString();
		}catch(e) {
			return false;
		}
		return true;
	},
	set : function(key, val) {
		if(this.isLocalStorage) {
			window.localStorage.setItem(key, val);
		}else {
			if(this.initData()) {
				this.domData.load(this.hName);
				this.domData.setAttribute(key, val);
				this.domData.save(this.name);
			}
		}
	},
	get : function(key) {
		if(this.isLocalStorage) {
			return window.localStorage.getItem(key);
		}else{
			if(this.initData()) {
				this.domData.load(this.hName);
				this.domData.getAttribute(key);
				this.domData.save(this.hName);
			}
		}
	},
	remove : function(key) {
		if(this.isLocalStorage) {
			return window.localStorage.removeItem(key);
		}else{
			if(this.initData()) {
				this.domData.load(this.hName);
				this.domData.removeAttribute(key);
				this.domData.save(this.hName);
			}
		}
	}
}