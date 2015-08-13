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
					// alert(p.container[0].files.length);
					p.imgHandle(e.target.files);
				});
			}
		}

		p.init();
	}

	ImgCompressor.prototype.imgHandle = function(files) {
		var i = 0, temp_arr = [];
		var cvs = $("<canvas id='img_canvas'></canvas>")[0];
		var that = this;
		var blob_url = null;

		alert(files.length);
		for(i; i<files.length; i++) {
			blob_url = this.url.createObjectURL(files[i])
			temp_arr.push(blob_url);

			this.build(temp_arr[i], function(info) {
				// that.url.revokeObjectURL(blob_url);
				var width = info.width;
				var height = info.height;

				var context = cvs.getContext("2d");
				cvs.width = width;
				cvs.height = height;
				context.drawImage(info, 0, 0, width, height);
				var url = cvs.toDataURL("image/jpeg", 3);
				
				$("#imgPreview").attr("src", url);
			});
		}

		cvs.remove();
	}

	ImgCompressor.prototype.build = function(url, callback) {
		var img = new Image();
		img.onload = function() {
			callback(this);
		}
		img.src = url;
	}

	window.ImgCompressor = ImgCompressor;
})(window, document);