(function(){	
	window.ImgAddText = {
		isSupport: null,
		canvas: document.createElement('canvas'),
		ctx: null,
		font: '',
		color: '',
		options: {
			src:'',list: []
		},
		es6_promise_cdn: 'https://cdn.bootcss.com/es6-promise/4.1.1/es6-promise.min.js',
		init: function(){//初始化
			//加载es6-promise的cdn
			var es6_promise = document.createElement('script');
			document.querySelector('head').appendChild(es6_promise);
			es6_promise.src = this.es6_promise_cdn;
			//是否支持canvas
			this.isSupport = !!this.canvas.getContext;
			if(this.isSupport){
				this.ctx = this.canvas.getContext("2d");
			}
		},
		getImage: function(options){//options.src可以是路径，也可以是base64
			var that = this;
			return new Promise(function(resolve, reject){
				if(that.isSupport === null){
					that.init();
				}
				if(that.isSupport){//支持canvas
					if(options.src){
						//设置参数，没有的值设为默认
						that.options.src = options.src;
						that.options.type = options.type||'image/jpeg';
						that.options.list = [];//清空
						options.list.forEach(function(item){//逐条保存
							that.options.list.push({
								font: item.font||'24px Arial',
								color: item.color||'#000000',
								x: item.x||0,
								y: item.y||0,
								text: item.text||'插入文字'
							})
						})
						//设置图片路径和加载完成事件
						var img = new Image();
						img.src = that.options.src;
						//监听图片加载，这里的this不指向ImgAddText，而是指向img
						img.addEventListener('load',function(){
							//设置宽高同时清空canvas内容
							that.canvas.setAttribute('width', img.width);
							that.canvas.setAttribute('height', img.height);
							//画图写字
							that.ctx.drawImage(img, 0, 0);
							that.options.list.forEach(function(item){//逐条输出
								that.ctx.font = item.font;
								that.ctx.fillStyle = item.color;
								that.ctx.fillText(item.text, item.x, item.y);
							})
							//转为图片输出base64
							resolve(that.canvas.toDataURL(that.options.type));
						})
					}else{
						reject('图片路径不能为空！');
					}
				}else{
					reject('浏览器不支持canvas，请升级！');
				}
			})
		}
	}
})()