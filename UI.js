var Misc = 
{
	/**
	 * 将数组的每个成员加上base值
	 *   方便帧序号的相对值计算
	 */
	ARR: function(base)
	{
		var i, n, arr = [];
		for(i=1, n=arguments.length; i<n; ++i)
			arr[i-1] = base + arguments[i];
		return arr;
	},


	StrN: function(str, len)
	{
		return ("          " + str).slice(-len);
	}
};



/****************************************
 * 开场界面模块
 ****************************************/
var UIOpen = Class(Layer,
{
	_lalScore: null,		// 顶端分数
	_sptSel: null,			// 选择图标

	_tickSel: null,



	/**
	 * 构造函数 - 创建开场界面
	 */
	constructor: function()
	{
		//this.Layer();		

		this._tickSel = new Tick(5);


		var spt, lal;

		// 分数文字
		this._lalScore = new Lable();
		this._lalScore.move(36, 48);
		this._lalScore.setColor("#FFF");
		this.append(this._lalScore);

		this.DispScore();

		// LOGO
		spt = new Sprite("res/UI.png", 376, 160);
		spt.move(56, 96);
		this.append(spt);

		// 选择文字
		lal = new Lable();
		lal.move(178, 272);
		lal.setText("1  PLAYER\n2  PLAYERS\nCONSTRUCTION");
		lal.setColor("#FFF");
		this.append(lal);

		// 选择图标
		this._sptSel = new Sprite("res/Tank.png", 32, 32);
		this._sptSel.move(130, 272);
		this._sptSel.setFrameSeq([28, 42]);
		this.append(this._sptSel);
	},


	OnEnter: function()
	{
		// 显示-开场层
		this.show();
		this.setY(448);

		// 滚动过程中不显示坦克图标
		this._sptSel.hide();
	},


	OnLeave: function()
	{
		// 隐藏-开场界面
		this.hide();
		this._sptSel.hide();
	},


	OnUpdate: function(T)
	{
		if(T <= 224)
		{
			//
			// 按START跳过滚动画面
			//
			if(Input.IsPressed(InputAction.START))
				T = 224;

			this.setY(448 - T * 2);
		}
		else if(T == 225)
		{
			// 显示-坦克图标
			this._sptSel.show();
		}
		else
		{
			//
			// 坦克图标动画
			//
			if(this._tickSel.On())
				this._sptSel.nextFrame();
		}

		//
		// 按START进入游戏
		//
		if(Input.IsPressed(InputAction.START))
			return App.MyApp.Go(App.GameUI);

		return T;
	},


	DispScore: function()
	{
		//
		// "I- 当前分  HI- 最高分"
		//
		//var sCur = Misc.StrN(App.Game.Score? App.Game.Score : "00", 11);

		//this._lalScore.SetText("I-" + sCur + "  HI- " + App.Game.ScoreHi);
	}
});