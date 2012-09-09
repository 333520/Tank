/****************************************
 * 游戏逻辑模块
 ****************************************/
var Game = Class({  

	static:{className:"Game"},
	Stage: 1,					// 当前关数
	Life: 2,					// 当前生命
    Players: 1,                 // 游戏人数
	Score: 0,					// 当前得分
	ScoreHi: 20000,				// 游戏最高分
	ScoreBonus: 20000,			// 下一个加命的分数

	FirstStart: true,			// 第一次开始（需要选关）	
	GameOver: false,
	StgClr: false,

	KillTypeNum: null,			// 打掉每种坦克的数目
	
	_iBirthDelay: 0,			// 出现间隔(随关数增加会加快)
	_tickBirth: null,			// 出现剩余时间


	_tickStgClr: null,			// 过关倒计时

	_iEnemyNum: 0,
	_iEnemyID: 0,

	_bPressd: false,
	_timerSlide: 999,

	constructor: function()
	{
		this._tickBirth = new Tick(30);
		this._tickStgClr = new Tick(200);
	},


	NewStage: function()
	{
		// 新的场景
		App.Scene.BuildMap();

		//
		// 计数清零
		//
		this._iEnemyNum = 0;
		this._iEnemyID = 0;

		this.KillTypeNum = [0, 0, 0, 0];

		this.StgClr = false;
		this._tickStgClr.Reset();

		// 关数越后坦克出现间隔越短
		this._iBirthDelay = 150 - this.Stage * 3;

		// 第一辆坦克出现的时间固定
		this._tickBirth.Reset(30);

		App.GameUI.LableStg.setText(this.Stage + "");
	},


	/**
	 * GameOver后数据归零
	 */
	Reset: function()
	{
		this.FirstStart = true;
		this.GameOver = false;

		this.Stage = 1;
		this.Score = 0;
		this.ScoreBonus = 20000;

		this.Life = 2;
		this._DisplayLife();
	},
	



	/**
	 * 摧毁敌人坦克
	 */
	KillEnemy: function(type)
	{
		//
		// 打掉的类型统计
		//
		if(type != -1)
			++this.KillTypeNum[type];

		/*
		 * 打掉了最后辆坦克，
		 * 并且屏幕上没有剩余的，
		 *   进入过关倒计时。
		 */
		if(--this._iEnemyNum == 0 && this._iEnemyID == 20)
			this.StgClr = true;
	},


	/**
	 * 基地被摧毁
	 */
	BaseDestroy: function()
	{
		App.Scene.BaseBoom();
		this.GameOver = true;
	},


	/**
	 * 加分数
	 */
	SocreAdd: function(n)
	{
		this.Score += n;

		//
		// 加1条命
		//
		if(this.Score > this.ScoreBonus)
		{
			this.ScoreBonus += 20000;
			this.LifeInc();
		}
	},


	/**
	 * 加减命
	 */
	LifeInc: function()
	{
		++this.Life;
		this._DisplayLife();
	},


	LifeDec: function()
	{
		--this.Life;

		if(this.Life < 0)
			this.GameOver = true;
		else
			this._DisplayLife();
	},


	_DisplayLife: function()
	{
		App.GameUI.LableLife.SetText(this.Life + "");
	},


	/**
	 * 游戏逻辑更新
	 */
	Update: function()
	{
		var Tanks = App.Scene.Tanks;
		var rnd = Math.random;


		// 更新场景界面
		App.Scene.Update();

		//
		// 更新玩家坦克
		//
		if(Tanks[0].IsIdle() && this.Life >= 0)
			App.Scene.CreatePlayer();

		Tanks[0].Update();


		//
		// 电脑坦克还没到上限，继续产生
		//
		if (this._iEnemyNum < Const.MAX_TANK-1 &&
			this._iEnemyID != 20 &&
			this._tickBirth.On())
		{
			App.Scene.CreateEnemy(this._iEnemyID);

			++this._iEnemyNum;
			++this._iEnemyID;
			this._tickBirth.Reset(this._iBirthDelay);
		}

		/*
		 * 过关倒计时检测
		 *
		 * 此过程中玩家仍可以控制坦克，
		 * NPC状态也在更新（已没有存活的），
		 * 此时若玩家打掉总部，游戏在统计完分数后结束。
		 */
		if(this.StgClr && this._tickStgClr.On())
			return true;


		/*
		 * 更新NPC的状态:
		 *   坦克一直往前开,遇障碍随机转弯
		 */
		var bFreezed = App.Scene.Bonus.IsFreezed();
		var i, tank;

		for(i = 1; i < Const.MAX_TANK; ++i)
		{
			tank = Tanks[i];

			/*
			 * 如果当前处于定时状态，
			 *   则放弃对NPC的命令，
			 *   但其界面更新依然进行。
			 *
			 * （定时过程中NPC的发出的子弹仍在动，
			 *   带奖励的坦克仍保持闪烁，
			 *   只是不开火和移动）
			 */
			tank.Update();

			if(bFreezed || !tank.IsLive())
				continue;

			//
			// 随机开火
			//
			if(rnd() < 0.03)
				tank.Fire();

			/*
			 * 前进受阻，
			 *   停留随机时间，
			 *   并随机换方向。
			 */
			if(!tank.Go())
			{
				if(rnd() < 0.2)
					tank.SetDir(4 * rnd() >> 0);
			}
		}
	},


	/**
	 * 接受玩家的控制
	 */
	Command: function()
	{
		var player = App.Scene.Tanks[0];

		if(!player.IsLive())
			return;

		//
		// 开火 (按住GAME_A或GAME_C键)
		//
		if(Input.IsPressed(InputAction.GAME_A) || 
		   Input.IsPressed(InputAction.GAME_C))
		{
			player.Fire();
		}

		/**
		 * 冰上自动滑行
		 *
		 * 遇到以下之一则停止滑行：
		 *   滑完tickSlide步；
		 *   碰到障碍；
		 *   滑出冰层。
		 *
		 * 滑行前半短时间玩家无法控制方向，
		 *   之后可以。
		 */
		if(this._timerSlide < 24)
		{
			if(!player.Go() || !player.OnIce())
				this._timerSlide = 999;

			if(++this._timerSlide < 12)
				return;
		}

		//
		// 接受玩家移动指令
		//
		switch(true)
		{
			case Input.IsPressed(InputAction.UP):		//上
				player.SetDir(0);
				break;
			case Input.IsPressed(InputAction.RIGHT):	//右
				player.SetDir(1);
				break;
			case Input.IsPressed(InputAction.DOWN):		//下
				player.SetDir(2);
				break;
			case Input.IsPressed(InputAction.LEFT):		//左
				player.SetDir(3);
				break;
			default:
				//
				// 如果在冰上停住将滑行一段距离
				//
				if(this._bPressd)
				{
					if(player.OnIce())
						this._timerSlide = 0;

					this._bPressd = false;
				}
				return;
		}

		//
		// 滑行的坦克得到控制
		//
		this._timerSlide = 999;

		this._bPressd = true;
		player.Go();
	}
});







/********************************************
 * JavaScript BattleCity v1.1
 *   By EtherDream (C) 2007
 ********************************************/
var App = window["App"] = Class(
{
	static:
	{
		//
		// 全局实例
		//
		MyApp: null,		// 主类
		Scene: null,		// 场景对象
		Game: null,			// 游戏逻辑对象
        Player: 1  ,
		OpenUI: null,		// 子UI界面
		GameUI: null,
		ScoreUI: null,
		OverUI: null
	},


	_curUI: null,
	_tickUI: 0,
	_oTimer: null,

	constructor: function()
	{
		/*
		 * Loader类位于WebPlay.js，
		 * 用来预加载图片资源。
		 * WebPlay库使用的图片必须通过此类加载。
		 *
		 * 构造器指定一个图片资源数组，
		 * 设置回调接口后开始加载。
		 *
		 * 当所有资源加载完成后，
		 * 将调用接口complete方法。
		 *
		 * 其余还有process，error方法，
		 * 详细参考WebPlay源文件。
		 */
		new Loader(["res/Tank.png", "res/Terr.png", "res/Boom.png", "res/Misc.png", "res/UI.png", "res/Frag.png"])
			.setListener(this);
	},


	/**
	 * Loader回调接口 -- complete
	 */
	complete: function()
	{
		App.MyApp = this;

		App.Game = new Game();
		
	    var UI =
		[
			App.OpenUI = new UIOpen(),
			App.GameUI = new UIGame()
			//App.ScoreUI = new UIScore(),
			//App.OverUI = new UIOver()
		];
		
		this._CreateUI(UI);
		App.Scene = new Scene();
		this.Go(App.OpenUI);
		
		/*


		var UI =
		[
			App.OpenUI = new UIOpen(),
			App.GameUI = new UIGame(),
			App.ScoreUI = new UIScore(),
			App.OverUI = new UIOver()
		];

		this._CreateUI(UI);

		App.Scene = new Scene();

		// 进入开场界面
		this.Go(App.OpenUI);
		*/
	},


	_CreateUI: function(UI)
	{
		//
		// 创建主界面
		//
		var i, layWrap = new Layer();

		layWrap.setSize(512, 448);
		layWrap.setClass("GameScreen");
		layWrap.attach(document.body);		// 添加到页面
        

		//
		// 添加所有子界面
		//
		for(i = 0,len=UI.length; i < len; ++i)
		{
			UI[i].hide();
			UI[i].setSize(512, 448);

			layWrap.append(UI[i]);
		}
	},


	OnTimer: function()
	{
		var t = this._curUI.OnUpdate(this._tickUI);

		if(t != -999)
			this._tickUI = t + 1;
		else
			this._tickUI = 0;
	},


	/**
	 * UI切换功能。
	 *
	 * 每个UI对象必须实现3个方法：
	 *   1.OnEnter  (进入场景)
	 *   2.OnLeave  (离开场景)
	 *   3.OnUpdate (刷新场景)
	 *
	 * 调用Go方法，进入一个指定的UI。
	 *
	 * 当进入一个UI时，
	 * 上个UI的OnLeave方法将被调用，
	 * 接着调用当前UI的OnEnter方法，
	 * 此后定时器将不断调用当前UI的OnUpdate方法。
	 */
	Go: function(UI)
	{
		if(this._curUI)
			this._curUI.OnLeave();

		UI.OnEnter();
		this._curUI = UI;

		if(!this._oTimer)
		{
			this._oTimer = new Timer(this, 16);
			this._oTimer.Start();
		}

		return -999;
	}
});