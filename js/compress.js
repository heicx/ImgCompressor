(function(window, document, undefined) {
	var c = console;
	var ImgCompressor = function(container, params) {
		if(!(this instanceof ImgCompressor)) {
			return new ImgCompressor(container, params);
		}

		var defaults = {}
		var p = this;

		p.url = window.URL || window.webkitURL;
		p.params = params;

		p.container = typeof(container) === "string" ? $(container) : false;

		p.init = function() {
			if(p.container) {
				p.container.change(function(e) {
					p.imgHandle(e.target.files);
				});
			}
		}

		p.init();
	}

	ImgCompressor.prototype.imgHandle = function(files) {
		var i = 0, temp_arr = [];

		for(i; i<files.length; i++) {
			temp_arr.push(this.url.createObjectURL(files[i]));
		}
		this.create(temp_arr);
	}

	ImgCompressor.prototype.create = function(arr) {
		var canvas = $("<canvas id='img_canvas'></canvas>")[0];
		
		for(var i = 0; i < arr.length; i++) {
			this.src = this.tempImg(arr[i], function(data) {
				console.log(data);
			});
		}
	}

	ImgCompressor.prototype.tempImg = function(url, callback) {
		var img = new Image();
		img.onload = function() {
			callback(img);
		}
		img.src = url;
	}

	window.ImgCompressor = ImgCompressor;
})(window, document);