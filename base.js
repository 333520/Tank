/***************************
*Class方法，模拟类的实现  
*************************/
var Class=function(base,ext){            //存在ext的话base则为基类,ext继承base
   var obj,proto={};  
  if(ext!=null){
       obj=ext;
	   proto=new base;  
	   proto[base.className]=proto.constructor;

   }else{
      obj=base;
   }
   var stat=obj.static||{},
   func=obj.constructor;
   for(var i in obj){
       proto[i]=obj[i];
   }
   for(var i in stat){
       func[i]=stat[i];
   }
   func.prototype=proto;
   return func;
};


/*******************************
*构造游戏基础类
********************************/
var Layer, Sprite, TiledLayer, Lable,
	Sound, Loader, Input;
var doc=document;

/**
 * 按键常量
 * @enum {number}
 */
var InputAction =
{
	NO_REPEAT:	1e8,

	UP:		87,		//W
	DOWN:	83,		//S
	LEFT:	65,		//A
	RIGHT:	68,		//D

	GAME_A:	73,		//I
	GAME_B:	79,		//O
	GAME_C:	75,		//K
	GAME_D:	76,		//L

	START:	13,		//Enter
	SELECT:	16		//Shift
};

(function(doc){

	var ver = navigator.userAgent;
	var _FF_ = /Firefox/.test(ver);
	var _IE_ = /MSIE/.test(ver);
	var _IE6_ = /MSIE 6/.test(ver);
	var _IE7_ = /MSIE 7/.test(ver) || doc.documentMode == 7;


	if(_IE6_)
		try{doc.execCommand("BackgroundImageCache", false, true)}catch(e){}


/****************************
*Layer类
*****************************/
Layer=Class({
	constructor:function(){
		this._div = doc.createElement("div");
		this._sty = this._div.style;
		this._sty.cssText = "position:absolute;overflow:hidden";
	},
	
	static:{className:"Layer"},
	
  	x: 0,
	
	setX:function(v) {this._sty.left = (this.x = v) + "px"},
	
	Y: 0,
	
	setY:function(v) {this._sty.top = (this.y = v) + "px"} ,
	
	width: 0,
	
	setWidth:function(v) {this._sty.width = (this.width = v) + "px"},

	height: 0,
	
	setHeight:function(v) {this._sty.height = (this.height = v) + "px"},

	zIndex: -1,
	
	setZ:function(v){this._sty.zIndex = v;this.zIndex=v;},

	setSize:
		function(w, h)
		{
			this.setWidth(w);
			this.setHeight(h);
		},

	move:
		function(x, y)
		{
			this.setX(x);
			this.setY(y);
		},
	moveBy:
		function(dx, dy)
		{
			this.move(this.x + dx, this.y + dy);
		},

	visible: true,
	
	setVisible:function(v){
	
		if(this.visible != v)
		{
			this.visible = v;
			this._sty.display = v? "block" : "none";
		}
	},
	
	show: function(){this.setVisible(true)},
	
	hide: function(){this.setVisible(false)},

	setBG: function(v){this._sty.background = v},
	
	setClass: function(name){this._div.className = name},

	append: function(layer){
	
		if(layer instanceof Layer)
		{
			this._div.appendChild(layer._div);
			return this;
		}

		return Error("Argument must be a Layer type");
	},

	attach: function(dom){dom.appendChild(this._div)}
});


/*******************************************************
 * Class Lable
 *******************************************************/
	Lable = Class(Layer,
	{
		constructor: function(text)
		{
			this.Layer();

			this._sty.font = "22px 'Arial Black'";

			if(typeof text == "string")
				this.SetText(text);
		},

		setColor: function(color)
		{
			this._sty.color = color;
		},

		setText: function(s)
		{
			s = s.replace(/&/g, "&amp;")
					.replace(/</g, "&lt;")
					.replace(/>/g, "&gt;")
					.replace(/\n/g, "<br/>")
					.replace(/ /g, "&nbsp;");
			this.setHTML(s);
		},

		setHTML: function(s)
		{
			this._div.innerHTML = s;
		},

		setAlign: function(v)
		{
			this._sty.textAlign = v;
		},

		setCSS: function(v)
		{
			for(var p in v)
				this._sty[p] = v[p];
		}
	});


/*******************************************************
 * Class Sprite
 *******************************************************/
	Sprite = Class(Layer,
	{
		_iFrCol: 0,
		_iFrNum: 0,
		_iImgW: 0,
		_iImgH: 0,

		_arrDef: null,		// 默认序列
		_arrSeqs: null,		// 序列数组

		_iSeqLen: 0,		// 序列长度 (arrSeqs.length - 1)
		_curSeq: 0,			// 序列ID
		_curFrm: 0,			// 实际帧ID (arrSeqs[序列ID] )

		_rectColl: null,




		constructor: function(image, frameWidth, frameHeight)
		{
		    this.Layer();
			this.setImage(image, frameWidth, frameHeight);
		},


		/**************************************************
		 * SetImage
		 *   设置精灵图片及帧尺寸
		 **************************************************/
		setImage: function(image, frameWidth, frameHeight)
		{
			var size = Loader.ImgCache[image];
			if(!size)
				throw Error("Image " + image + "not loaded");


			// 图像尺寸
			var w = this._iImgW = size.w;
			var h = this._iImgH = size.h;


			this._iFrNum = 1;
			this._arrDef = [];

			//
			// 非静态精灵
			//
			if(frameWidth != null)
			{
				// 检验尺寸是否合法
				if(w % frameWidth || h % frameHeight)
				{
					throw Error("Image " + image +
									" (" + w + "*" + h + ") size must be an integral multiple of (" +
									frameWidth + "*" + frameHeight + ")");
				}

				// 计算帧的纵横个数
				this._iFrCol = w / frameWidth;
				this._iFrNum = this._iFrCol * (h / frameHeight);

				//
				// 精灵默认帧序列
				//
				for(var i = 0; i < this._iFrNum; ++i)
					this._arrDef[i] = i;

				this._arrSeqs = this._arrDef;
				this._iSeqLen = this._iFrNum - 1;

				// 以帧的尺寸作为精灵的尺寸
				w = frameWidth;
				h = frameHeight;
			}

			this._sty.backgroundImage = "url(" + image + ")";
			this.setSize(w, h);
		},


		/**************************************************
		 * SetFrameSeq
		 *   重新定义动画帧的播放序列。
		 *
		 *   若新的动画序帧列长度小于原先的，
		 *   播放进度重新开始。
		 *
		 *   未提供参数则恢复默认序列。
		 **************************************************/
		setFrameSeq: function(seqs)
		{
			var l;

			if(seqs)
			{
				l = seqs.length;
				if(l <= 0)
					throw Error("Invalid frame sequence");
			}
			else
			{
				// 恢复默认序列
				seqs = this._arrDef;
				l = this._iFrNum;
			}

			if(l < this._iSeqLen + 1)
			{
				this._curSeq = 0;
				this._curFrm = seqs[0];
			}

			this._arrSeqs = seqs;
			this._iSeqLen = l - 1;

			this._updateImg();
		},

		/**************************************************
		 * GetFrameSeqLength
		 *   返回帧播放序列数组长度
		 **************************************************/
		getFrameSeqLength: function()
		{
			return this._iSeqLen + 1;
		},

		/**************************************************
		 * GetRawFrameCount
		 *   返回原始帧数量
		 **************************************************/
		getRawFrameCount: function()
		{
			return this._iFrNum;
		},

		/**************************************************
		 * SetFrame
		 *   设置当前帧序列进度
		 **************************************************/
		setFrame: function(seqId)
		{
			this._curFrm = this._arrSeqs[seqId];

			if(this._curFrm == null)
				throw Error("Invalid frame index");

			this._curSeq = seqId;
			this._updateImg();
		},

		/**************************************************
		 * GetFrame
		 *   返回当前帧序列进度
		 **************************************************/
		getFrame: function()
		{
			return this._curSeq;
		},

		/**************************************************
		 * NextFrame
		 *   显示精灵动画序列的下一帧
		 *   若当前已是最后一帧，则跳到第一帧。
		 **************************************************/
		nextFrame: function()
		{
			if(this._curSeq == this._iSeqLen)
				this._curSeq = 0;
			else
				++this._curSeq;

			this._curFrm = this._arrSeqs[this._curSeq];
			this._updateImg();
		},

		/**************************************************
		 * PrevFrame
		 *   显示精灵动画序列的上一帧
		 *   若当前是第一帧，则跳到最后一帧。
		 **************************************************/
		prevFrame: function()
		{
			if(this._curSeq)
				--this._curSeq;
			else
				this._curSeq = this._iSeqLen;

			this._curFrm = this._arrSeqs[this._curSeq];
			this._updateImg();
		},

		/**************************************************
		 * CollidesWith
		 *   检测是否与指定的精灵发生碰撞。
		 **************************************************/
		collidesWith: function(s)
		{
			if(!s.Visible)
				return;

			var x1, y1, w1, h1;
			var x2, y2, w2, h2;

			/*
			 * 自身精灵坐标
			 */
			var r = this._rectColl;
			if(r)
			{
				x1 = this.X + r.X;
				y1 = this.Y + r.Y;
				w1 = r.Width;
				h1 = r.Height;
			}
			else
			{
				x1 = this.X;
				y1 = this.Y;
				w1 = this.Width;
				h1 = this.Height;
			}

			/*
			 * 目标精灵
			 */
			r = s._rectColl;
			if(r)
			{
				x2 = s.X + r.X;
				y2 = s.Y + r.Y;
				w2 = r.Width;
				h2 = r.Height;
			}
			else
			{
				x2 = s.X;
				y2 = s.Y;
				w2 = s.Width;
				h2 = s.Height;
			}

			return (x1 - w2 < x2 && x2 < x1 + w1) && (y1 - h2 < y2 && y2 < y1 + h1);
		},


		/**************************************************
		 * DefCollRect
		 *   定义精灵的碰撞检测矩形。
		 *   无参数则清除检测矩形。
		 **************************************************/
		defCollRect: function(rect)
		{
			this._rectColl = rect;
		},


		/**
		 * 更新精灵画面
		 */
		_updateImg: function()
		{
			if(this._iFrNum == 1)
				return;

			var col = (this._curFrm % this._iFrCol);
			var row = (this._curFrm / this._iFrCol) >> 0;

			var left = -col * this.Width;
			var top = -row * this.Height;

			this._sty.backgroundPosition = left + "px " + top + "px";
		}
	});



/**************************
*Loader类
**************************/
	Loader = function(arrSrc)
	{
		var arrImg = [];
		var iLoaded = 0;
		var lisn;

		function handleLoad(img)
		{
			img.onload=null;
			var src = arrSrc[img.tid];

			// 缓存当前图像尺寸数据
			Loader.ImgCache[src] = {w: this.width, h: this.height};
			
			++iLoaded;

			// 加载进度回调
			if(typeof lisn.process == "function")
				lisn.process(src, iLoaded, arrSrc.length);

			// 加载完成回调
			if(iLoaded == arrSrc.length &&
			   typeof lisn.complete == "function")
			{
				lisn.complete();
			}
		}

		function handleError()
		{
			if(typeof lisn.error == "function")
				lisn.error(arrSrc[this.tid], iLoaded, arrSrc.length);
		}


		/**************************************************
		 * SetListener:
		 *   设置回调接口
		 * l:
		 *   process(img_src, curID, totalID){}
		 *      载入进度
		 *   error(img_src, curID, totalID){}
		 *      载入错误
		 *   complete(){}
		 *      载入完成
		 **************************************************/
		this.setListener = function(l)
		{
			if(!l)
				throw Error("Invalid interface");
			lisn = l;

			var i, oImg;
			for(var i = 0; i < arrSrc.length; ++i)
			{
				oImg = arrImg[i] = new Image();			
				oImg.tid = i;
				oImg.src = arrSrc[i];
				
				if(oImg.compelete){
					handleLoad(oImg); 
				}else{
					oImg.onload =function(){ handleLoad(this);};
					oImg.onerror = handleError;
				}

			}
		}
	};

	Loader.ImgCache = {};



/*******************************************************
 * Singleton: Input
 *******************************************************/
	Input =(function()
	{
		var arrRepeat = [],
			arrQuery = [],
			arrPress = [];


		for(var i=0; i<128; ++i)
		{
			arrRepeat[i] = 1;
			arrQuery[i] = -1e8;

			//
			// 默认按键延时
			//
			arrRepeat[InputAction.START] =
			arrRepeat[InputAction.SELECT] =
			arrRepeat[InputAction.GAME_C] =
			arrRepeat[InputAction.GAME_D] = InputAction.NO_REPEAT;
		}

		function handleKeyDown(e)
		{
			e = e || event;
			Input.KeyPress(e.keyCode);
		}

		function handleKeyUp(e)
		{
			e = e || event;
			Input.KeyRelease(e.keyCode);
		}

		/**
		 * 键盘事件
		 */
		if(doc.addEventListener)
		{
			doc.addEventListener("keydown", handleKeyDown, false);
			doc.addEventListener("keyup", handleKeyUp, false);
		}
		else
		{
			doc.attachEvent("onkeydown", handleKeyDown);
			doc.attachEvent("onkeyup", handleKeyUp);
		}


		return {
		/**
		 * 指定键置于按下状态
		 */
		KeyPress: function(key)
		{
			arrPress[key] = true;
		},

		/**
		 * 指定键置于提起状态
		 */
		KeyRelease: function(key)
		{
			arrPress[key] = false;
			arrQuery[key] = -1e8;
		},

		/**
		 * 指定键最短触发事件
		 */
		SetKeyRepeat: function(key, repeat)
		{
			arrRepeat[key] = repeat;
		},

		/**
		 * 检测指定的键是否按下
		 */
		IsPressed: function(key)
		{
			if(!arrPress[key])
				return false;

			var iTime = +new Date();
			if(iTime - arrQuery[key] < arrRepeat[key])
				return false;

			arrQuery[key] = iTime;
			return true;
		}

		}
	})();


})(doc);



/**
 * 自动复位计数器
 *
 * 例：
 *   var t = new Tick(3); //定义步长为3的计数器
 *   t.On();              //返回false (内部计数=2)
 *   t.On();              //返回false (内部计数=1)
 *   t.On();              //返回true  (内部计数=0，重置到3)
 */
	function Tick(count)
	{
		var t = count;

		this.On = function()
		{
			if(--t)
			{
				return false;
			}
			else
			{
				t = count;
				return true;
			}
		};

		this.Reset = function(v)
		{
			if(v != null)
				t = count = v;
			else
				t = count;
		};
	};

/**
 * 精确定时器
 */
function Timer(lisn, time)
{
	var last = +new Date;
	var delay = 0;
	var tid;


	function Update()
	{
		//
		// 时间差累计
		//
		var cur = +new Date;
		delay += (cur - last);
		last = cur;

		if(delay >= time)
		{
			lisn.OnTimer();
			delay %= time;
		}
	}

	this.Start = function()
	{
		tid = setInterval(Update, 1);
	};

	this.Stop = function()
	{
		clearInterval(tid);
		delay = 0;
	};
}








