
 var Cookie = window.jQuery.featherUi.Cookie;
function dataGrid(obj, opt) {
	var option = {
		target : obj,
		dom : "",
		titleList : {},
		dataList : [],
		dropCheckList : {},
		emptyMsg : "暂时没有数据"
	}
	this.option = $.extend({}, option, opt || {});
	this.init();
}
dataGrid.prototype = {

	init : function () {
		var self =this, opt = self.option; opt.keyName = 'ggjc-ui-g';
		var pathName = location.pathname.replace(/\.html$/,"");
		opt.cookieName = "ggjc-ui-" + pathName.split('/').slice(1).join("-");
		self.keyVal = Cookie.get(opt.cookieName) == "[object Object]" ? "{}" : Cookie.get(opt.cookieName) || "{}";
		opt.target = opt.target || opt.dom;
		self.keyVal = JSON.parse(self.keyVal);
		self.keyVal.sortMsg = $.extend({}, {isMinToMax:"", prop: ""}, self.keyVal.sortMsg);

		self.container = $("<table class='grid-container'></table>").appendTo(opt.target);
		self.gridHeader = $("<thead class='grid-header'></thead>").appendTo(self.container);
		self.gridBody = $("<tbody class='grid-body'></tbody>").appendTo(self.container);

		if(isEmptyObj(self.keyVal.checkList)) {

			for(var i in opt.titleList) {
				opt.dropCheckList[i] = "checked";
			}	
		}else {
			opt.dropCheckList = self.keyVal.checkList;
		}

		self.titleList = isEmptyObj(self.keyVal.titleList) ? getKeys(opt.titleList) : self.keyVal.titleList;
		self.keyVal.sortMsg.isMinToMax == "" ? self.initDom() : self.keyVal.sortMsg.isMinToMax ? self.sortMinToMax(self.keyVal.sortMsg.prop) : self.sortMaxToMin(self.keyVal.sortMsg.prop);
	},

	initDom : function() {
		var self = this, opt = this.option, titleList = self.titleList, dataList = opt.dataList, sclice = Object.prototype.toString;

		 self.gridHeader.html("");
		 self.gridBody.html("");

		 var sortClassName = self.keyVal.sortMsg.isMinToMax == "undefined" ? "" : self.keyVal.sortMsg.isMinToMax ?  "ggjc-ui-sort-up-icon" : "ggjc-ui-sort-down-icon";
		// 添加头部内容
		var headHtml = [], bodyHtml = [];
		for(var i = 0; i < titleList.length; i++) {
			headHtml.push("<th class='ggjc-ui-grid-col " +  opt.keyName + "-" + titleList[i] + "'><div class='ggjc-ui-grid-header " + (self.keyVal.sortMsg.prop!=""&&self.keyVal.sortMsg.prop == titleList[i] ? sortClassName : "")  + "' data-ggjc-ui-header-prop='" + titleList[i] + "'>" + (sclice.call(opt.titleList[titleList[i]]) == "[object Object]" ? opt.titleList[titleList[i]]["name"] : opt.titleList[titleList[i]]) + "<div class='ggjc-ui-arrow-icon'></div></div><div class='ggjc-ui-grid-icon'></div></th>");
		}

		for(var j = 0; j < dataList.length; j++) {
			var spanHtml = [];

			for(var i = 0; i < titleList.length; i++) {
				if(sclice.call(opt.titleList[titleList[i]]) != "[object Object]") {
					spanHtml.push("<td class='ggjc-ui-grid-td " +  opt.keyName + "-" + titleList[i] +  "'>"+ (dataList[j][titleList[i]] ? dataList[j][titleList[i]] : "") + "</td>");		
				}else {
					var domHtml = opt.titleList[titleList[i]]["dom"] ? $("#" + opt.titleList[titleList[i]]["dom"]).html() : opt.titleList[titleList[i]]["domHtml"];
					spanHtml.push("<td class='ggjc-ui-grid-td " +  opt.keyName + "-" + titleList[i] + "'>" + getVal(domHtml, dataList[j])  + "</td>");
				}
			}
			bodyHtml.push("<tr class='ggjc-ui-grid-row'>" + spanHtml.join("") + "</tr>")	
		}
		if(dataList.length == 0 && opt.emptyMsg) opt.target.append("<div class='ggjc-ui-no-info'>"+ opt.emptyMsg +"</div>")
		self.gridHeader.html("<tr>" + headHtml.join("") + "</tr>");
		self.gridBody.html(bodyHtml.join(""));

		self.destory();
		self.bindEvent();
		self.hideCol();
		$(window).trigger('griddata_dominit');
	},

	bindEvent : function() {
		var self = this, opt = this.option, dropCheckList = opt.dropCheckList, slice = Object.prototype.toString;

		$(".ggjc-ui-grid-col").hover(self.hoverOver, self.hoverOut);

		$(".ggjc-ui-grid-icon").click(function(e) {
			$(this).empty().html("<div class='ggjc-ui-nav-list'><span class='ggjc-ui-sort-down'></span><span class='ggjc-ui-sort-up'></span><div class='ggjc-ui-checked-list'></div></div>");
		})

		$(".ggjc-ui-grid-icon").on("click", ".ggjc-ui-checked-list", function(e) {
			e.stopPropagation();
			self.ele = $(this);
			var dropHtml = [], opt = self.option; 
			for(var i in opt.titleList) {
				dropHtml.push("<p class='" + dropCheckList[i] + "' data-href='" + i + "'><span class='ggjc-ui-checked-icon'></span>" + (slice.call(opt.titleList[i]) == "[object Object]" ?  opt.titleList[i]["name"] : opt.titleList[i])+ "</p>");
			};
			$(this).html("<div class='ggjc-ui-drop-list'>" + dropHtml.join("") + "</div>");
			self.position();
		})
		$(".ggjc-ui-grid-icon").on("click", ".ggjc-ui-sort-down", function() {
			$thisParent = $(this).parent().parent().parent();
			var prop = $thisParent.find(".ggjc-ui-grid-header").attr("data-ggjc-ui-header-prop");
			self.sortMaxToMin(prop);
		});
		$(".ggjc-ui-grid-icon").on("click", ".ggjc-ui-sort-up", function() {
			$thisParent = $(this).parent().parent().parent();
			var prop = $thisParent.find(".ggjc-ui-grid-header").attr("data-ggjc-ui-header-prop");
			self.sortMinToMax(prop);
		})
		$(".ggjc-ui-grid-icon").on('click', 'p', function(e) {
			e.stopPropagation();
			var className = $(this).data("href");
			if(self.islastChecked() && $(this).hasClass("checked")) return;
			$(this).toggleClass("checked");

			if($(this).hasClass("checked")) {
				dropCheckList[className] = "checked";
			}else {
				dropCheckList[className] = "";
			};

			self.keyVal.checkList = dropCheckList;

			Cookie.set(opt.cookieName, JSON.stringify(self.keyVal), {expires : 10000});
			self.hideCol();
		})

		$(".ggjc-ui-grid-header").mousedown(function(e) {
			
	         self.sKlass = $(this).attr("data-ggjc-ui-header-prop");
	      
	         opt.titleList[self.sKlass]["canMove"] = typeof opt.titleList[self.sKlass]["canMove"] == "undefined" ? true : opt.titleList[self.sKlass]["canMove"];
	         if(slice.call(opt.titleList[self.sKlass]) == "[object Object]" && !opt.titleList[self.sKlass]["canMove"]) {
	         	return;
	         }
			$(".ggjc-ui-grid-header").mousemove(function(e) {
				e.stopPropagation();
				if(self.sKlass != $(this).attr("data-ggjc-ui-header-prop")) {
					$(this).find(".ggjc-ui-arrow-icon").show();
					$(this).siblings().find(".ggjc-ui-arrow-icon").hide();
				}
			})
		})

		$(".ggjc-ui-grid-header").mouseup(function(e) {
			self.eKlass = $(this).attr("data-ggjc-ui-header-prop");

			opt.titleList[self.eKlass]["canMove"] = typeof opt.titleList[self.eKlass]["canMove"] == "undefined" ? true : opt.titleList[self.eKlass]["canMove"];
			if(slice.call(opt.titleList[self.eKlass]) == "[object Object]" && !opt.titleList[self.eKlass]["canMove"] || slice.call(opt.titleList[self.sKlass]) == "[object Object]" && !opt.titleList[self.sKlass]["canMove"]) {
	         	return;
	         }
			$('.ggjc-ui-grid-header').off('mousemove');
			self.rankClass();
		})
	},

	hoverOver : function() {
		$(this).css({"background": "#e1e1e1"});
		$(this).find(".ggjc-ui-grid-icon").show();  
	},

	hoverOut : function() {
		$(this).css({"background": "-webkit-gradient(linear, 0 0, 0 100%, from(#fafafa), to(#f3f3f3))"});
		$(this).find(".ggjc-ui-grid-icon").hide();
		$(this).find(".ggjc-ui-drop-list").hide();
		$(this).find(".ggjc-ui-arrow-icon").hide();
		$(this).find(".ggjc-ui-nav-list").hide();
	},

	islastChecked : function() {
		var opt = this.option, dropCheckList = opt.dropCheckList, j = 0;

		for(var i in dropCheckList) {
			if(dropCheckList[i] == "checked") {
				j++;
			}
		}

		return j > 1 ? false : true;
	},

	rankClass : function() {
		if(!this.sKlass) return;

		var self = this, title = self.titleList;sKlassIndex = title.indexOf(self.sKlass), eKlassIndex = title.indexOf(self.eKlass);
		opt = self.option;
		title[sKlassIndex] = self.eKlass;
		title[eKlassIndex] = self.sKlass;
		
		self.keyVal.titleList = title;
		Cookie.set(opt.cookieName, JSON.stringify(self.keyVal), {expires : 10000});
		self.initDom();
	},

	hideCol : function() {
		var opt = this.option, dropCheckList = opt.dropCheckList;

		for(var i in dropCheckList) {
			if(dropCheckList[i]) {
				$("." + opt.keyName + "-" + i).show();
			}else {
				$("." + opt.keyName + "-" + i).hide();
			}
		}
	},
	sortMaxToMin : function(prop) {
		var self = this, opt= self.option, dataList = opt.dataList;
		dataList = dataList.sort(function(a, b) {
			return self.sortStr(a, b, prop);
		});
		self.initDom();
		self.keyVal.sortMsg = {isMinToMax: false, prop: prop};
	},
	sortMinToMax : function(prop) {
		var self = this, opt= self.option, dataList = opt.dataList;
		dataList = dataList.sort(function(a, b) {
			return self.sortStr(a, b, prop, true);
		});
		self.initDom();
		self.keyVal.sortMsg = {isMinToMax: true, prop: prop};
		Cookie.set(opt.cookieName, JSON.stringify(self.keyVal), {expires : 10000});
	},
	sortStr : function(a, b, prop, bool) {
		var self = this;
		var pre = self.getAciiCode(a[prop]), next = self.getAciiCode(b[prop]);
		 return bool && pre - next || next - pre;
	},
	getAciiCode : function(str) {
		var result;
		 var regCh = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
	 	if(isNaN(Number(str))) {
	 		if(regCh.test(str.substr(0, 1))) {
	 			result = "1";
	 		}else {
	 			result = str.substr(0, 1)
	 		}
	 		result = result.charCodeAt(0);
	 	}else {
	 		result = str;
	 	}
	 	return parseFloat(result);	
	},

	position : function(e) {
		var self = this, ele = self.ele, childEle = ele.find('.ggjc-ui-drop-list');

		if(ele.offset().left + childEle.outerWidth() > $(window).width()) {

			childEle.css({"left" : "-" + (childEle.outerWidth() - ele.outerWidth()) + "px"});
		}
	},
	destory : function() {
		$(".ggjc-ui-grid-header").off();
		$(".ggjc-ui-grid-icon").off();
		$(".ggjc-ui-grid-col").off();
	}
};
function getKeys(obj) {
	var arrKey = [];
	for(var i in obj) {
		arrKey.push(i);
	};
	return arrKey;
};
function isEmptyObj(obj) {
	if(obj instanceof Array) return !obj.length;
	for(var i in obj) {
		if(obj.hasOwnProperty(i)) {
			return false;
		}
	}
	return true;
};
function getVal(str, obj) {
	var domHtml = str.replace(/\$\w+\$/gi, function(matchs) {
				var returns = obj[matchs.replace(/\$/g, "")];
				return (returns + "") == "undefined"? "": returns;
			});
	return domHtml;
}
$.fn.dataGrid = function(opt) {
	new dataGrid($(this), opt)
};