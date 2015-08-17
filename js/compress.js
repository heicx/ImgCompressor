(function(window, document, undefined) {
	var c = console;
	var ImgCompressor = function(trigger, params) {
		if(!(this instanceof ImgCompressor)) {
			return new ImgCompressor(trigger, params);
		}

		var defaults = {}
		var p = this;

		p.url = window.URL || window.webkitURL;
		p.params = params;
		p.trigger = typeof(trigger) === "string" ? $(trigger) : false;
		p.count = 0;
		p.files = null;
		p.arr = [];

		p.init = function() {
			if(p.trigger) {
				p.trigger.change(function(e) {
					p.imgHandle(e.target.files);
				});
			}
		}

		p.init();
	}

	ImgCompressor.prototype.imgHandle = function(files) {
		var that = this;

		that.files = files;
		that.each(that.files[0], that.callback);
	}

	ImgCompressor.prototype.callback = function(url, that) {
		if((that.count + 1) === (that.files.length)) {
			that.arr.push(url);
			that.send(that.arr);
			that.arr = [];
		}else {
			that.arr.push(url);
			that.each(that.files[that.count++], that.callback);
		}
	}

	ImgCompressor.prototype.each = function(file, callback) {
		var that = this;
		var blob_url = null;
		var cvs = $("<canvas id='img_canvas'></canvas>")[0];

		blob_url = that.url.createObjectURL(file);
		that.build(blob_url, function(info) {
			var width = info.width;
			var height = info.height;
			var url = null;
			var context = cvs.getContext("2d");

			cvs.width = width;
			cvs.height = height;
			context.drawImage(info, 0, 0, width, height);
			url = cvs.toDataURL("image/jpeg", 0.3);
			cvs.remove();
			
			var timer = setInterval(function() {
				if(url !== null) {
					callback(url, that);
					clearInterval(timer);
				}
			}, 1000);
		});
	}

	ImgCompressor.prototype.build = function(url, callback) {
		var img = $("<img id='compareImg' style='display:none;'>")[0];
		var that = this;
		var data = {};

		img.onload = function() {
			that.url.revokeObjectURL(url);
			img = null;
			callback(this);
		}

		img.src = url;
	}

	ImgCompressor.prototype.send = function(data) {
		var that = this;

		if(typeof(that.params["callback"]) === "function") {
			var obj = {};
			obj.images = data;
			that.params["callback"](obj);
		}
	}

	window.ImgCompressor = ImgCompressor;
})(window, document);