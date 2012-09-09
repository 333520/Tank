/*
*扩展Array contains方法
*/

Array.prototype.contains=function(str){
	 var a=new RegExp("(^|,)" + item.toString() + "(this.|,)").test(this);
	  return a;
}

/****************
*地图
*****************/
var RES_DATA='AAAAAAAAAAAAAAeAeAeAeAeAeAAeAeAeAeAeAeAAeAeAeVeAeAeAAeAeAYAYAeAeAAYAYAbAbAYAYAbAbbAYAYAbbAbJAYYAbAbAYYAJAbAbAeeeAbAbAAeAeAeAeAeAeAAeAeAYAYAeAeAAeAeA^bZAeAeAAAAAA`C[AAAAAAAAAAAAAAAAAAAAAAABBAAAVAAAVAAAAAAeAVAAAeAeAeAAeAAAAeeAeVeAAAAeAAAAAVAAABAAeAAVAAeBeVBBAAAeAAVABAAAeeeBBBVAABeAAAAVBeAeAeAeAVeAVAeAeAeVeAAeAeAeeeAeVeAAeAeAeeeAAAAAAeAAA^bZAeAeAAeAeA`C[AeeeADDBBBBAAAAAAAAAAAAAAAAAAeAAAeAAAAABBBeAAAAASSSeBBBAAAAAAAAABBBBAAAeAeee[BBBBeeeYAeA`ABBBBAAeAAAA`AABAAAAVVVAABAAbAbAAAAABBBBe[`e[`YYYBBBBAAAAAeAbbBBBBeAALAAAYYBBBAeeALA^bZABBBAVeeAA`C[AeAAAAAAAAAAAAAAAAABBBBDDABBAAAAAAAABABBAAbeebbAAABBAA`eeeeeebAJJAAeeeeeeee[AAA`YAAAYeeA[AEA`ALALAe[AAAAAeAbbAAe[AEEAAeeeeeeeeAAAA`eeeeeeee[AAAYYeeeeeeYYAAAeebYeeYbeeABBAYYA^bZYYABBVBAAA`C[AABBVCCCCCCCCCCBBBBBAADDDAAAAeeAAAAAAASAbAeAAAJJVAAVAeAAAeAAAAAAeAeeeAeeAEEAEYAAAYAAAAEAAAAAbAEEAEEEAeeeeAAEeAe[AAAAAAAAEAAAAAQLAEEEAEAVAeAQAAAAAbbAAAAAQeeAAAAeYYYebAAAeeYAA^bZAYeAAYAAAA`C[AAAAACCCCCDDAAAAAAAABBBBBAAAAA`A[BBAAAA[QA[AAA`B[`BA[QA[AeA`B[`BAeAAeAVAeBAeBAAA`JAeAYLABBee[AABeBAA`eeAAAA`BBB[AAAAVeeAYBBBY`eeVJJJAbABAbAJJJAeAAeAAAeAAAAAe[AAYAYAA`eBAAYAA^bZAABBBAAbAA`C[AAbBBCCCCCCCBBAAAAAAAAADDAAAAAAAJJAAAAAAVJJJAAAAVAAAAVAAABAJVVAAAVAAABVAAAVAAAAAABVVAAAJVAAVABVVVAVAAAAAQAVVAAAVVAAALAAAVAVVVAAQAAQVAAAVVBAAVAAVAAAAVBAAVVAAJJVAABAAVAAAAAAAA^bZAJASVSSAAA`C[AAAAAAAABBBBCCCCCCAAAAAAAAAeAAeAbAeAAABeeeAeASAe[AABBBAAYAeAYA`[BEEEEEEEEEEAEAeAAAAbbAAAAAAAeAA`eeYeYJJeeAeA`eeBeSSeAAAVASABBBBAAEEAEEEEEAEEEEBBA`AAbbAAAAABBeA[AA`ASbeABSeA[^bZAYAeAAAAAA`C[AbAYACCCCCCCDDBBBBAAAAAAAAAAeAAAAASBAAeAAAAASBQVLAeAAASBQVLAJBAAAAQVLAJBAAAAAAAAJBAAAAAAAAAAABSBABSBAAAVeAQVLAQVLAeVAAABJBABJBAAAAAAASAAASAAAAeAAQVLAQVLAAeeAABJBABJBAAeAAbAA^bZAAbAAAAeeA`C[AeeAAAAAAAABBBBCCCCCCCDDDAAAAAAAAAAAAAA`YeAAAAAAeY[`YAAeABBAeAA`eAAAeBBBBeAA`eAA`eBVVBe[Ae`bbeEEEEEEeeeAeeeVVeVVeee[AAeeVAeAVee[AAAeeeeeeeee[AeBYYYVVYYYYBeeBBBBBBBBBBBeAABBB^bZBBBBAAAA[A`C[AA[AAAAAAAAAAAAAABBCCCCDDAAAAAVAeAeeAAA`eeeeAeAAAAAAAA[AeAeeABBBA`AAAAAVABBBBA`AeeeVeeBBYVAYYYVAAeABBA``eeeAVBBBBBAAAAAVAABBBBBeAVeABBBBVBBBeA`eBBBBBAAAAe[AeBBAAAAJeeeAAABBA^bZAeA`AAbBBA`C[AAAAABBBBBDDDDDDCCCCBBBBBAAAAAAAeeeAAAAeeebAbAAeAAAAAAAeAYAAAAeeAEEEEEAe[AAeJAASSSEAeAVLeAeAeeeEEEAEeeAAAAAVEAAAEJAAEEEAEEeeAEAAAAAAAAeJJAEEEAeeeAAAAAAAAAAAAeAJJAAAeeA`eAAAA^bZAeAAeAAAAA`C[AAAAACCCCCCCCBBBBBBDDDDDDAAAAbAAAbAAAAAeeeeAAAeeeeAAeAAAAeAAAAVAAVAeYAAAYeAeeAeA[BSVSB`AVeAYAABBBBBAAJeeSAABBBBBAAbeeVA[BJVJB`AeAeeAebAAAbeAVAeVAAAAeAAAAeAeeeeeAAAeeeVVeeAAY^bZYAAeAeeAAA`C[AAAAACCCCCCCCBBBBBBBBDDDDAAAAAAAAAAAAABBAAbeeebAABBBAA`eeeee[AABAAAeeBeBeeAAAAAAeBBeBBeAAABAAeeeeeeeAABBBAAeBeBeAABBEEEAeeeeeAEEEAAAA`````AAAAAAAA[[[[[AAAAQQQAAAAAAALLL[[[AA^bZAA```LLLQA`C[ALQQQCCCCCCCCCCBBBBDDDDDDAAAAeeAAeAAAAABBeeAAAeAAAABBBBBBBBeeAAABJeBeeeBBBBeVBBeBBBJBBeLeAABBeSBBBBeAeAAeeeeeBBee[BBQJeeAAAeYAAABAeAeASbYBBe[BAeAA`eYBBeAABAee[`YBBbBeBBAAeAB^bZeBYBAAAYAA`C[ABBBAAABBBBBBBBBBDDDDDDDDAAAAAAAAAAAAAAAVBVAAAAAAAAAAABABSAAAAAAABAAAABbAAAAAABBAABABSAAAAABABABAABbAAAABAABAAABBSAAAABAAAABBBBbAAAABAABABBBBAeAAAAABAABBBVeeAAAAABABBBBVeeAA^bZBABBBVVeeA`C[BAABBAAAAAAAAAAAAAAAABBDDAAAAbAAAAAbAAAeAeeAAGGGeeAAeAAeAVGGGGGAGGGLeAAeGGGGAGGGGGGee`[AAAAAQGGGGe`[AJJeeeeGGGGGGGeeAAAeeGGGGLAAAAeeeAGGGeeAeAGGGeGAAAAeAeAGGGGGJAJAAbeAeGGGG^bZAeAAAeeLAA`C[AeAeADDBBCCCCCCCCAAAAAAAAAAAAAAAAVVVBAAeAAAAAAVAAVAeBeAAAeeeeAVAAeBeAAeABeVVAAAeABVeBAeAAAAAAAVAeVeeAAAAAeeVeAVAAAAAAAeABeVBAAAAAVVVBAeAAeeAAAVAeeeeAAeVVAAVAAVAAAAAVeeABVVVA^bZAAeVVAAAAA`C[AAAVVDDDDAACCCCCCBBBBBBBBAeAeAeAeAeAeAAeAeAeAeAeAeAAJAJAJAJAJAJAbAbAeAAAeAbAbeAeYeAeAeYeAeJAJAVAJAVAJAJBBAAeABAeAABBBBBBeYBYeBBBBBBBBBBBBBBBBBbAbAeBBBeAbAbAeAeAABAAeAeAAeAeA^bZAeAeAAYAYA`C[AYAYABBBDDDDDDDDAAAACCCCCAAAAAAAAAAAAASAAAAASAAAAASAAAAAAAAAAAAA\\YZAAAAAA[AAA[AA\\Z\\Z\\Z[A\\_[X[[[[[[[[Z]YXYAXAXA_WXAXWAAAAAAA^_AAAAAAAAAAA_\\AAAABAAAAAAAAAAABBBAAAAAAAAABBVBBAA^bZAABBVVVBBA`C[ABBVVBBBBBBBBAACCDDDDDDDDAAAbbbAAbAAAAAbeeeeeeeeAAAABBBBBBBBeeAABBAAAAAABBeeABAVAAVAAABBBABAVAAVAAABBBABAABAAAABBee[BBBBBBBBBeee[eBBeeBBBeeeeAAeeeeeeeeeeAVVAeVeeeeee[AVAVeYV^bZeeVVVAAAAA`C[AAAAACCCCCCCCBBAAAAAADDDDAAAAABAAAAAAAAAAABVBAAAAAAAABAABAABBAAAABeBAAABeeBAAAABeBAAABBAABBAABAABAAAABVeBAAABVBAABABVeBAAABAABVBAeBAABAAABABAABAABeBABeBAAAAAABeBAABAABAABAAB^bZAABVBBVBAA`C[ABeBABBBBBBBBAAAAAACCDDDDAAAAAAAAAAAAAAAAAAVVAAAAAAAAAAAAVAAAAAAAVVBBeVeBBVVAAAAVBBVBBVAAABAAAVBBBVAAABVBAAABBBAAABVBAAASJBJSAAABAAAAVASAVAAAAAAAVAAVAAVAAAAAAAAAAAAAAAAAAAAA^bZAAAAAAAVAA`C[AAVAADDDDDDCCCCBBBBBBBBBBAAVAeJAAAA`AAAAeAeBAYeeeAAABBAeB`[AAAVVBBBBBBeeeA`eAAABBbbJeA`eY`eJAbYYAAAeYA``AbeGGGGGGGGG`AYAGGGGGGGGGAAVAGGGGGGGGGeAeAGGGGGGGGG`AeAGGGGGGGGG`AeAA^bZGGGGGAAYAA`C[AGGGGCCCCDDBBBBAAAAAAAAAAAAAVAeAeAeAVAAeAeAAAAAVAAAAeAeAAVAAVAVVAeAAAeAVeAAAVAAAAeeAeeAVAAAAVAeAAeeAeeAVAVAAeAVAAVeAAAeeAeAAAeVAAAVeeAeeAeeAAeAeAAAeVAAAAeeAAAeAeeVAVAAeeAeeA^bZAeVAAeAeAA`C[AeeeACCBBBBBBBBDDDDDDDDDDAAEEAAAAAAAAASAAEBA[AAAAAABSAAAALA[AEEABBAJb`AALBEAABBBAAVb`AAAASBBJSA`AVbAASBBJAAYVA`AJABBAAAAA[YVAABBBAAEBQAA[YSJBBAEEA`AQAAAAABAAAAAA`ABEAAJVAAAA^bZAEEAAVVAAA`C[AAAAVBBBBBBDDDDDDAAAACCCCAAAAVAAAAAAAAVVAAVAAVVAAAAAVAAVAAAVAVVBAVAAVVVABAVAAAeAAAAVAVVVAABVVAVeVeeAAAAAAVBVBAAeAAVVAAVAABAAVAAVAAAeAAVAAVVeVABVVVBBeVVAeVAAAAeAAAABBAeAAAAVA^bZABAeAAAAVA`C[AVAeACCDDDDDDDDBBBBBBBBAAAAAAAAAAAAQLAAAAAAASAAAVAAAAAAAbBbAe[AAAAAASBBBSe[AAAAAbBBGBBe[AAAASBBGGGBB[AAAbBBGGGGGBBbASBBGGGGGGGBBSBBGGGGGGGGGBBABGGGGGGGGGBAABGGGGGGGGGBAABGGG^bZGGGBAABGGA`C[AGGBABBDAAAAAAAAAAAAAAACCAAAAAAAAAAeAAAeEEAVAeAAAAAAAEEeBBBEEAVAAAAAABBBEEeAAAVAAEEABAAAAABBeAEEVAAAAeABBBAAAAAAVAAVAeEEAeAAAAAAAVAEEBBEEBBAeAAAAABAEEBBEEAAAAVBAAABBEEAAAeAe^bZAAAAAeAAAA`C[AeVAACCCCCCCCCCBBBBDDDDDDAAAAAAAAAAAAAAAAAAbbAAASAAASSAbBBSAbBbAbBBbBBBBbBBBbBBBBBBBBBBBBBVBEBBBBBEBBBBBBEEEBBBEEEBVBBBBEBVBBBEBBBBBBBBBBBBBBBBBBBBYYBBBBBJJBBBYAAYBBBJAAJYYA^bZYYYAAAAAAA`C[AAAAAAAAABBBBBBBBCCCCDDDDAAAEAAAAEAAAAEEAEAEEEEAEEEBBeAAeAAEAEBEBEEEEAVAAeBBBBBAEAAEAEEEEBEEAEAEEAAEAAAAAeBeAeBAEAAEAEEBEEEEABeAEeAAeAAEABBEAEEEAEEAEeEEEAAAAeABBAABEAAEAEEEB^bZAEAEEAEAAA`C[AAAAACCCBBBBBBBBDDDDDDCCCGGGGGGGGGGGGGGGGGGGGGGGGGGGGGeGGGGGeGGGGeAeAeGeAeAeGGYYeAAAAAeYYGGGGebeVebeGGGVGGGAJAJAGGGVGGGGAbAbAGGGGGGGGAeAeAGGGGGGGeAAbAAeGGGGeGeAJJJAeGeGAebeA^bZAebeAAYAAA`C[AAAYADDDDDDDDAAAAAACCBBBBAAAAVAAAAVAAAAVAAAVAAVBBAAAAVAAAAVBSLAAAAAVABBBBBAQAALAAVBBVBAAVAAJLBAVBBVAAQAAABBBBBAAVAAAASLBAVBAAAVAAABBBVAVASAAVABBBVAAAAQAAAAAAVAAAAAAAAQVAAAAA^bZASLAALASAA`C[AAAAABBBBDDDDDDDDCCCCBBBBAAAA[`AAAAAAA[[[`A[AA[[AAA[[[eeAAA[e[AA``Ae[AA`[eeAAA[Ae`[A[eeeAAA[`AAe[e``eAAA[AA`ee[A[eAAA`AA[ee[A[eAAA`YYAeeeA[[YeA`AA`[e`[[[``AA[Ae`[eeAA`AAA[`[^bZe[A[AAA[`A`C[AeeAACCCCBBBBBBBBBBDDDDDDABAAAAAAAAABABAAABABABBAABJA`A\\_A[`A\\_JAA`AcdA[`AcdAA_\\A[`V_\\A[`AEABAABABAABAEA]W]W]W[`a`AAAY[[A[A[`Y`YAAYWYWWAWXAXYAAAAGAAAAAGAAAAAGBGAAAGBGAeBAAGA^bZAGAeeVBAAA`C[AAeeVDCBCACCCCDDBBBBBBDDD';




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
    AUP:    38,     //箭头上
	ADOWN:  40,     //箭头下
	ALEFT:  37,     //箭头左
	ARIGHT:  39,    //箭头右
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
	    static:{className:"Lable"},
		constructor: function(text)
		{
			this.Layer();

			this._sty.font = "22px 'Arial Black'";

			if(typeof text == "string")
				this.setText(text);
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


		static:{className:"Sprite"},

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
			if(!s.visible)
				return;

			var x1, y1, w1, h1;
			var x2, y2, w2, h2;

			/*
			 * 自身精灵坐标
			 */
			var r = this._rectColl;
			if(r)
			{
				x1 = this.x + r.x;
				y1 = this.y + r.y;
				w1 = r.width;
				h1 = r.height;
			}
			else
			{
				x1 = this.x;
				y1 = this.y;
				w1 = this.width;
				h1 = this.height;
			}

			/*
			 * 目标精灵
			 */
			r = s._rectColl;
			if(r)
			{
				x2 = s.x + r.x;
				y2 = s.y+ r.y;
				w2 = r.width;
				h2 = r.height;
			}
			else
			{
				x2 = s.x;
				y2 = s.y;
				w2 = s.width;
				h2 = s.height;
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

			var left = -col * this.width;
			var top = -row * this.height;

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
			Loader.ImgCache[src] = {w: img.width, h: img.height};
			
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
 * Class TiledLayer
 *******************************************************/
TiledLayer = Class(Layer,
{   
	static:{className:"TileLayer"},
	_arrTile: null,
	_arrAniTile: null,

	_iColNum: null,
	_iRowNum: null,
	
	_iTileW: null,
	_iTileH: null,



	constructor: function(columns, rows, image, tileWidth, tileHeight)
	{
		this.Layer();


		this._arrTile = [];
		this._arrAniTile = [];

		this._iColNum = columns;
		this._iRowNum = rows;

		var oFrag = doc.createDocumentFragment();

		/*
		 * 创建砖块数据
		 */
		var c, r, T;

		for(r = 0; r < rows; r++)
		{
			T = this._arrTile[r] = [];

			for(c = 0; c < columns; ++c)
			{
				var oDIV = doc.createElement("div");
				var oSty = oDIV.style;

				oSty.position = "absolute";
				oSty.backgroundRepeat = "no-repeat";

				oFrag.appendChild(oDIV);

				T[c] =
				{
					id: 0,				// 砖块ID（动态砖为负数）
					staticID: 0,		// 静态ID（实际显示的序列）
					sty: oSty
				};
			}
		}

		this._div.appendChild(oFrag);
		this.SetStaticTileSet(image, tileWidth, tileHeight);
	},


	/**************************************************
	 * CreateAniTile
	 *   创建一个动态砖块，并返回砖块ID
	 *   staticTileIndex:
	 *     必须为0，或者存在的静态砖块ID
	 * 返回值从-1开始逐次递减。
	 **************************************************/
	CreateAniTile: function(staticTileIndex)
	{
		if(staticTileIndex < 0 || staticTileIndex > this._iFrNum)
			throw Error("Invalid tile index");

		var aniTile = this._arrAniTile;
		var n = aniTile.length;

		aniTile[n] =
		{
			id: staticTileIndex,
			ref: {}
		};

		return ~n;
	},

	/**************************************************
	 * SetAniTile
	 *   批量设置动态砖块图像序列
	 **************************************************/
	SetAniTile: function(aniTileIndex, staticTileIndex)
	{
		var aniTileInfo = this._arrAniTile[~aniTileIndex];
		if(!aniTileInfo)
			throw Error("Invalid animated tile index");


		if(aniTileInfo.id == staticTileIndex)
			return;
		aniTileInfo.id = staticTileIndex;


		// 
		// 枚举并修改设置了此砖块的格子
		// p = row * 1e5 + col
		//
		var p, col, row;

		for(p in aniTileInfo.ref)
		{
			if(p > 0)
			{
				col = (p % 1e5);
				row = (p / 1e5) >> 0;

				this._arrTile[row][col].staticID = staticTileIndex;
				this._DrawTileImg(col, row);
			}
		}
	},


	/**************************************************
	 * GetAniTile
	 *   返回动态砖块当前对应的图像序列
	 **************************************************/
	GetAniTile: function(aniTileIndex)
	{
		var aniTileInfo = this._arrAniTile[~aniTileIndex];
		if(!aniTileInfo)
			throw Error("Invalid animated tile index");

		return aniTileInfo.id;
	},


	/**************************************************
	 * FillCells
	 *   填充指定范围内的砖格
	 **************************************************/
	FillCells: function(col, row, numCols, numRows, tileIndex)
	{
		var r, r2 = row + numRows;
		var c, c2 = col + numCols;

		for(r = row; r < r2; ++r)
			for(c = col; c < c2; ++c)
				this.SetCell(c, r, tileIndex);
	},


	/**************************************************
	 * GetCell
	 *   返回指定砖格的砖块序列
	 **************************************************/
	GetCell: function(col, row)
	{
		return this._arrTile[row][col].id;
	},


	/**************************************************
	 * SetCell
	 *   设置指定砖格的图片序列
	 **************************************************/
	SetCell: function(col, row, tileIndex)
	{
		var tile = this._arrTile[row][col];
		var staticID = tileIndex;

		/*
		 * 之前是动态砖，取消此引用
		 */
		if(tile.id < 0)
			delete this._arrAniTile[~tile.id].ref[row*1e5 + col];

		/*
		 * 当前是动态砖，添加引用
		 */
		if(tileIndex < 0)
		{
			var aniTileInfo = this._arrAniTile[~tileIndex];

			aniTileInfo.ref[row*1e5 + col] = true;
			staticID = aniTileInfo.id;
		}

		tile.id = tileIndex;
		tile.staticID = staticID;

		this._DrawTileImg(col, row);
	},


	/**************************************************
	 * SetStaticTileSet
	 *   指定砖块层源图像
	 **************************************************/
	SetStaticTileSet: function(image, tileWidth, tileHeight)
	{
		var size = Loader.ImgCache[image];
		if(!size)
			throw Error("Image " + image + "not loaded");


		this._iImgW = size.w;
		this._iImgH = size.h;


		//
		// 检验尺寸是否合法
		//
		if(tileWidth < 1 || tileHeight < 1)
			throw Error("Invalid argument");


		if(this._iImgW % tileWidth || this._iImgH % tileHeight)
		{
			throw Error("Image: " + image +
							" (" + this._iImgW + "*" + this._iImgH + ") size must be an integral multiple of (" +
							tileWidth + "*" + tileHeight + ")");
		}

		//
		// 计算帧的纵横个数
		//
		this._iFrCol = this._iImgW / tileWidth;
		this._iFrNum = this._iFrCol * (this._iImgH / tileHeight);


		this.setSize(this._iColNum * tileWidth, this._iRowNum * tileHeight);


		//
		// 创建地砖元素
		//
		var r, c, T;

		for(r = 0; r < this._iRowNum; ++r)
		{
			T = this._arrTile[r];

			for(c = 0; c < this._iColNum; ++c)
			{
				//
				// 更新砖块图片
				//
				var sty = T[c].sty;

				sty.backgroundImage = "url(" + image + ")";
				sty.backgroundPosition = "0 -9999px";

				sty.left = c * tileWidth + "px";
				sty.top = r * tileHeight + "px";
				sty.width = tileWidth + "px";
				sty.height = tileHeight + "px";
			}
		}

		this._iTileW = tileWidth;
		this._iTileH = tileHeight;
	},


	/**
	 * 更新砖块层图片
	 */
	_DrawTileImg: function(col, row)
	{
		var tile = this._arrTile[row][col];
		var id = tile.staticID - 1;

		var c = (id % this._iFrCol);
		var r = (id / this._iFrCol) >> 0;
		var left = -c * this._iTileW;
		var top = -r * this._iTileH;

		tile.sty.backgroundPosition = left + "px " + top + "px";
	}
});	
	


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

		}
		
		//
		// 默认按键延时
		//
		arrRepeat[InputAction.START] =
		arrRepeat[InputAction.SELECT] =
		arrRepeat[InputAction.GAME_C] =
		arrRepeat[InputAction.GAME_D] = InputAction.NO_REPEAT;

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
		tid = setInterval(Update, 13);
	};

	this.Stop = function()
	{
		clearInterval(tid);
		delay = 0;
	};
}








