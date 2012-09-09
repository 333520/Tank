

/****************************************
 * 游戏场景模块
 ****************************************/
var Scene = Class(
{
    static:{className:"Scene"},
	Tanks: null,		// 所有坦克 new Array(MAX_TANK)
	Bonus: null,		// 奖励实例


	/**
	 * 本游戏地图大小(13*13)，共169地块格子。
	 *
	 * 每个地块格子32*32px，用 4 个block标记障碍。
	 *
	 * ||============||
	 * ||  b1 ||  b2 ||
	 * ||=====||=====||
	 * ||  b3 ||  b4 ||
	 * ||============||
	 *
	 *
	 *   砖块的block又可分 4 小块，
	 *      block值 = 1 + 2 + 4 + 8
	 *   |-----|-----|
	 *   |  1  |  2  |
	 *   |-----|-----|
	 *   |  4  |  8  |
	 *   |—————|—————|
	 *
	 *   每个bit代表各个碎片块
	 */
	Block: null,			// Array(26*26)

	_arrStageData: null,	// 游戏数据
	_arrEnemyData: null,

	_curStgMap: null,		// 当前关数据
	_curStgEnemy: null,


	_tickWater: null,		// 更新水的动画
	_statWater: null,

	_oMapLayer: null,		// 地砖层（WebPlay.TiledLayer）
	_oBoomBase: null,		// 总部爆炸对象

	_arrGrass: null,		// 草地精灵数组
	_numGrass: 0,

	_arrFragMap: null,		// 碎片精灵数组
	_arrFragFree: null,



	/**
	 * 构造函数 - 初始化场景
	 */
	constructor: function()
	{
		this._tickWater = new Tick(60);
		this._statWater = new Tick(2);

		this._arrGrass = [];


		//
		// 初始化障碍物数组，碎片数组
		//
		this._arrFragMap = [];
		this._arrFragFree = [];
	
		this.Block = [];

		for(i = 0; i < 26; ++i)
		{
			this._arrFragMap[i] = [];
			this.Block[i] = [];
		}

		//
		// 创建地砖层
		//
		this._oMapLayer = new TiledLayer(13, 13, "res/Terr.png", 32, 32);
		this._oMapLayer.setZ(Const.Z_MAP);
		this._oMapLayer.CreateAniTile(4);
		this._oMapLayer.setBG("#000");
		this._oMapLayer.move(Const.POS_X, Const.POS_Y);

		App.GameUI.append(this._oMapLayer);


		//
		// 初始化坦克对象
		//
		this.Tanks = [new (MyTank())];				// 玩家坦克

		for(i = 1; i < Const.MAX_TANK; ++i)		// 敌人坦克
		{
			this.Tanks[i] = new (NPCTank());
		}

		//奖励对象
		this.Bonus = new Bonus();

		//总部爆炸对象
		this._oBoomBase = new Boom(true);

		//载入数据资源（map.dat）
		this._LoadData(RES_DATA);
	},


	BaseBoom: function()
	{
		this._oBoomBase.Start(176, 368);

		// 报废的鹰 (Terr.png:3)
		this.SetMapCell(6, 12, 3);
	},


	/**
	 * 更新场景画面
	 */
	Update: function()
	{
		this.Bonus.Update();
		this._oBoomBase.Update();

		//
		// 更新水的动画
		//
		if(this._tickWater.On())
			this._oMapLayer.SetAniTile(-1, this._statWater.On()? 4 : 5);
	},


	/**
	 * 创建玩家坦克
	 */
	CreatePlayer: function()
	{
		var tank = this.Tanks[0];

		tank.SetPos(128, 384);		// 总部左边
		tank.SetDir(0);				// 玩家坦克方向默认向上
		tank.StartBulProof(Const.TIME_BULPRF_DEF);	// 开启防弹衣
		tank.Birth();
	},


	/**
	 * 创建敌人坦克
	 */
	CreateEnemy: function(id)
	{
		var pos, i, tank;

		//
		// 找出一个空闲的坦克对象
		//
		for(i = 1; i < Const.MAX_TANK; ++i)
		{
			tank = this.Tanks[i];

			if(tank.IsIdle())
				break;
		}

		pos = id % 3;
		pos = (pos + 1) % 3;				// 敌人位置（0:中，1:右，2:左,...）

		this.SetMapCell(pos * 6, 0, 0);			// 出生地为空

		tank.SetPos(192 * pos, 0);			// 地图顶端
		tank.SetDir(2);						// 默认朝下
		tank.SetType(this._curStgEnemy[id]);	// 设置类型

		// 隐藏一个敌人标志
		App.GameUI.EnemyFlag[19 - id].hide();


		//
		// 是否为带奖励的红坦克
		//
		if(Const.BONUS_MAP[id])
		{
			tank.HasBonus();

			// 清除存在的奖励
			this.Bonus.Clear();
		}

		// 生产坦克
		tank.Birth();
	},



	/**
	 * 构造地图（每一关开始前）
	 */
	BuildMap: function()
	{
		var id = App.Game.Stage - 1;

		this._curStgMap = this._arrStageData[id];
		this._curStgEnemy = this._arrEnemyData[id];


		// 草地计数
		this._numGrass = 0;

		//
		// 填充地图每一格
		//
		var r, c;
		for(r = 0; r < 13; r++)
		for(c = 0; c < 13; c++)
		{
			this.SetMapCell(c, r, this._curStgMap[r][c]);
		}

		//
		// 隐藏多余的草地
		//
		var i, l = this._arrGrass.length;
		for(i = this._numGrass; i < l; ++i)
			this._arrGrass[i].Hide();


		// 设置总部鹰图标 (Terr.png:2)
		this.SetMapCell(6, 12, 2);

		// 玩家出生位置为空
		this.SetMapCell(4, 12, 0);
	},


	/**
	 * 清空地图（游戏结束后）
	 */
	ClearMap: function()
	{
		this._oMapLayer.FillCells(0, 0, 13, 13, 0);

		var i, l = this._arrGrass.length;
		for(i = 0; i < l; ++i)
			this._arrGrass[i].Hide();
	},


	/**
	 * 清空坦克
	 */
	ClearTank: function()
	{
		this.Bonus.Reset();

		for(var i = 0; i < Const.MAX_TANK; ++i)
			this.Tanks[i].Reset();
	},


	/**
	 * 获取4x4 block的内容
	 *   如果有一个不相同则返回-1
	 */
	GetBlock4x4: function(c, r)
	{
		var B = this.Block;
		var b = B[r][c];

		if (b == B[r  ][c+1] &&
			b == B[r+1][c  ] &&
			b == B[r+1][c+1])
		{
			return b;
		}

		return -1;
	},


	/**
	 * 设置地图格子内容
	 */
	SetMapCell: function(c, r, cellID)
	{
		//
		// 清除该位置可能的碎砖层
		//
		var x = c * 2;
		var y = r * 2;

		this._ClearFrag(x  , y  );
		this._ClearFrag(x+1, y  );
		this._ClearFrag(x  , y+1);
		this._ClearFrag(x+1, y+1);

		//
		// cellID 对应 res/Terr.png 的图标
		//
		if(cellID == 1)							// 草
		{
			var spt = this._arrGrass[this._numGrass];

			//
			// 草地位于坦克上层
			// 用精灵代替地砖渲染
			//
			if(!spt)
			{
				spt = this._arrGrass[this._numGrass] = new Sprite("res/Terr.png", 32, 32);
				spt.SetZ(Const.Z_GRASS);
				App.GameUI.Append(spt);
			}

			spt.Move(Const.POS_X + c * 32, Const.POS_Y + r * 32);
			spt.Show();
			this._numGrass++;

			// 清空之前遗留的地形
			cellID = 0;
		}
		else if(cellID == 2)					// 鹰
		{
			this._SetCellBlock(6, 12, Const.BLOCK_BASE1, 0xF);
		}
		else if(cellID == 3)					// 摧毁的鹰
		{
			this._SetCellBlock(6, 12, Const.BLOCK_BASE2, 0xF);
		}
		else if(cellID == 4)					// 水
		{
			this._SetCellBlock(c, r, Const.BLOCK_WATER, 0xF);

			// 水为动态砖
			cellID = -1;
		}
		else if(cellID == 6)					// 冰
		{
			this._SetCellBlock(c, r, Const.BLOCK_ICE, 0xF);
		}
		else if(7 <= cellID && cellID <= 21)	// 钢
		{
			this._SetCellBlock(c, r, Const.BLOCK_IRON, cellID - 6);
		}
		else if(cellID >= 22)					// 砖
		{
			this._SetCellBlock(c, r, Const.BLOCK_TILE, cellID - 21);
		}

		if(cellID == 0)							// 空
			this._SetCellBlock(c, r, Const.BLOCK_NONE, 0xF);

		// 渲染格子
		this._oMapLayer.SetCell(c, r, cellID);
	},


	/**
	 * 设置砖块碎片
	 */
	SetTileFrag: function(col, row, val)
	{
		var B = this.Block;
		var x1 = col - col % 2;
		var y1 = row - row % 2;

		var x2 = x1 + 1;
		var y2 = y1 + 1;

		var x, y;


		B[row][col] = val;

		/**
		 * 如果4个block中出现一个或多个空块，
		 *   那么隐藏这几个碎片精灵，
		 *   直接设置相应位置为空的大砖块。
		 */
		var i, tile = 0;

		for(i = 0; i < 4; ++i)
		{
			x = i % 2? x2 : x1;
			y = i < 2? y1 : y2;

			if(B[y][x])
				tile += (1 << i);	//tile = tile + 2^i
			else
				this._ClearFrag(x, y);
		}

		/**
		 * 设置合并后的大砖块
		 *   21 + 砖块序列 => Terr.png中砖块的具体位置
		 */
		this._oMapLayer.SetCell(x1/2, y1/2, tile? tile+21 : 0);

		if(val)
			this._DrawFrag(col, row, val);
	},


	/**
	 * 设置铁块碎片
	 */
	SetIronFrag: function(col, row, val)
	{
		var B = this.Block;
		B[row][col] = val;

		var x1 = col - col % 2;
		var y1 = row - row % 2;

		var x2 = x1 + 1;
		var y2 = y1 + 1;

		var x, y;
		var i, tile = 0;

		//
		// 计算碎铁块的形状
		//
		for(i = 0; i < 4; ++i)
		{
			x = i % 2? x2 : x1;
			y = i < 2? y1 : y2;

			if(B[y][x])
				tile += (1 << i);	//tile = tile + 2^i
		}

		this._oMapLayer.SetCell(x1/2, y1/2, tile? tile+6 : 0);
	},


	/**
	 * 砖块碎片 - 渲染
	 */
	_DrawFrag: function(col, row, val)
	{
		var spt = this._arrFragMap[row][col];

		if(!spt)
			spt = this._arrFragFree.pop();

		if(!spt)
		{
			spt = new Sprite("res/Frag.png", 16, 16);
			spt.SetZ(Const.Z_FRAG);

			App.GameUI.Append(spt);
		}

		spt.Show();
		spt.Move(Const.POS_X + col * 16, Const.POS_Y + row * 16);
		spt.SetFrame(val - 1);

		this._arrFragMap[row][col] = spt;
	},


	/**
	 * 砖块碎片 - 清除
	 */
	_ClearFrag: function(col, row)
	{
		var spt = this._arrFragMap[row][col];

		if(spt)
		{
			spt.Hide();

			this._arrFragFree.push(spt);
			this._arrFragMap[row][col] = null;
		}
	},


	/**
	 * 设置每个格子障碍。
	 *   每个格子占用4个block，用1bit表示
	 *   mask = 1 + 2 + 4 + 8
	 */
	_SetCellBlock: function(col, row, v, mask)
	{
		var B = this.Block;

		var x1 = col * 2;
		var x2 = x1 + 1;
		var y1 = row * 2;
		var y2 = y1 + 1;

		B[y1][x1] = (mask & 1)? v:0;
		B[y1][x2] = (mask & 2)? v:0;
		B[y2][x1] = (mask & 4)? v:0;
		B[y2][x2] = (mask & 8)? v:0;
	},


	/**
	 * 游戏数据载入
	 */
	_LoadData: function(v)             //载入游戏地图 arrStageData以及 arrEnemyData
	{
		var Map, Enemy;
		var i, r, c;
		var t, n = 0;
		var ch;


		this._arrStageData = [];
		this._arrEnemyData = [];

		for(i = 0; i < Const.MAX_STAGE; ++i)
		{
			Map = [];
			Enemy = [];

			for(r = 0; r < 13; r++)
			{
				t = Map[r] = [];

				for(c = 0; c < 13; c++)
					t[c] = v.charCodeAt(n++) - 65;
			}

			for(r = 0; r < 20; r++)
				Enemy[r] = v.charCodeAt(n++) - 65;

			this._arrStageData[i] = Map;
			this._arrEnemyData[i] = Enemy;
		}
	}
});




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
		this.setX(-512);

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
		if(T <= 256)
		{
			//
			// 按START跳过滚动画面
			//
			if(Input.IsPressed(InputAction.START))
				T = 256;

			this.setX(-512+T * 2);
		}
		else if(T == 257)
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
		//选择游戏人数
		//
		if((Input.IsPressed(InputAction.UP)||Input.IsPressed(InputAction.AUP))&&App.Player==2){
		   App.Player=1;
           this._sptSel.move(130, 272);	
	    }
		if((Input.IsPressed(InputAction.DOWN)||Input.IsPressed(InputAction.ADOWN))&&App.Player==1){
			App.Player=2;
			this._sptSel.move(130, 305);		 
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



/****************************************
 * 游戏界面模块
 ****************************************/
var UIGame = Class(Layer,
{   
    static:{className:"UIGame"},
	
	EnemyFlag: null,			// 电脑坦克标记

	LableLife: null,			// 生命数标签
	LableStg: null,				// 关数标签

	_lalStage: null,			// 银幕上的关数层

	_arrMask: null,
	_layInfo: null,				// 右侧信息栏

	_lalGameOver: null,			// 游戏结束升起的字
	_timerOver: 0,

	//_oSound: null,


	/**
	 * 构造函数 - 创建游戏界面
	 */
	constructor: function()
	{
		this.Layer();		// super


		this._tickWater = new Tick(60);
		this._statWater = new Tick(2);
		this._tickStgClr = new Tick(200);

		//this._oSound = new Sound("res/Open.mid");


		var spt, lal, lay;
		var i;

		//
		// 右边信息栏
		//
		this._layInfo = new Layer();
		this._layInfo.move(452, 0);
		this._layInfo.setSize(64, 448);

		this.append(this._layInfo);

		//
		// 创建敌人数标志
		//
		this.EnemyFlag = [];
		for(i = 0; i < 20; ++i)
		{
			spt = this.EnemyFlag[i] = new Sprite("res/Misc.png", 16, 16);
			spt.setFrame(10);
			spt.move(18 + 16 * (i%2), 34 + 16 * (i >> 1));

			this._layInfo.append(spt);
		}

		//
		// "1P"文字
		//
		lal = new Lable();
		lal.setText("I P");
		lal.move(14, 252);
		this._layInfo.append(lal);

		//
		// 生命图标
		//
		spt = new Sprite("res/Misc.png", 16, 16);
		spt.setFrame(11);
		spt.move(14, 280);
		this._layInfo.append(spt);

		//
		// 生命数-标签
		//
		this.LableLife = new Lable();
		this.LableLife.setText("2");
		this.LableLife.move(32, 272);
		this._layInfo.append(this.LableLife);

		//
		// 旗帜图标
		//
		spt = new Sprite("res/Misc.png", 32, 32);
		spt.setFrame(4);
		spt.move(14, 352);
		this._layInfo.append(spt);

		//
		// 关数-标签
		//
		this.LableStg = new Lable();
		this.LableStg.setAlign("right");
		this.LableStg.setSize(48, 30);
		this.LableStg.move(0, 380);
		this._layInfo.append(this.LableStg);



		//
		// 开幕层
		//
		this._arrMask = [];

		for(i = 0; i < 2; ++i)
		{
			lay = this._arrMask[i] = new Layer();
			lay.setSize(512, 224);
			lay.setBG("#666");
			lay.setZ(Const.Z_UI);

			this.append(lay);
		}

		//
		// 选关文字
		//
		this._lalStage = new Lable();
		this._lalStage.setSize(512, 25);
		this._lalStage.setY(210);
		this._lalStage.setZ(Const.Z_UI);
		this._lalStage.setAlign("center");

		this.append(this._lalStage);


		//
		// "GAME OVER"文字
		//
		this._lalGameOver = new Lable("GAME\nOVER");
		this._lalGameOver.move(212, 448);
		this._lalGameOver.setColor("#B53120");
		this._lalGameOver.setZ(Const.Z_UI);
		this._lalStage.setAlign("center");
		this._lalGameOver.hide();

		this.append(this._lalGameOver);
	},


	OnEnter: function()
	{
		// 显示-游戏界面
		this.show();

		this._arrMask[0].move(0, -240);
		this._arrMask[1].move(0, 464);

		//
		// 第一次开始隐藏信息栏
		//
		if(App.Game.FirstStart)
			this._layInfo.hide();
	},


	OnLeave: function()
	{
		// 隐藏-游戏界面
		this.hide();

		//
		// 复位相关对象
		//
		this._timerOver = 0;

		// 清空场景内对象
		App.Scene.ClearTank();
	},


	OnUpdate: function(T)
	{
		//
		// 主流程
		//
		if(T > 101)
		{
			var pass = App.Game.Update();

			if(pass)
				return App.MyApp.Go(App.ScoreUI);

			if(!App.Game.GameOver)
			{
				App.Game.Command();
				return T;
			}

			/*
			 * Game Over流程
			 *
			 * 触发条件：
			 *	 1.总部被打 -更新显示爆炸效果
			 *	 2.命没了
			 *
			 * 在Game Over的过程中，
			 *   玩家无法控制，但NPC仍然继续.
			 *
			 * 游戏结束也有可能发生在过关倒计时中，
			 *   这时无需升起Game Over文字。
			 */
			if(++this._timerOver <= 30)
			{
				//
				// 总部被打掉玩家仍可以控制一小会
				//
				App.Game.Command();
			}
			else if(this._timerOver <= 156)
			{
				//
				// 升起Game Over
				//
				if(!App.Game.StgClr)
				{
					this._lalGameOver.show();
					this._lalGameOver.setY(508 - this._timerOver*2);
				}
			}
			else if(this._timerOver <= 300)
			{
				// 进入记分前等待
			}
			else
			{
				this._lalGameOver.hide();

				// 进入计分流程
				return App.MyApp.Go(App.ScoreUI);
			}

			return T;
		}




		//
		// 界面流程
		//
		if(T < 20)
		{
			this._arrMask[0].moveBy(0, +12);	// 银幕合拢
			this._arrMask[1].moveBy(0, -12);
		}
		else if(T == 20)
		{
			this.setBG("#666");					// 当前关数界面
			this._lalStage.show();
		}
		else if(T == 21)
		{
			this._lalStage.setText("STAGE" + Misc.StrN(App.Game.Stage, 5));

			//
			// 第一次开始，停住选关
			//
			if(!App.Game.FirstStart)
				return T;

			--T;

			switch(true)
			{
			//
			// 加关数 (按住GAME_A或GAME_A键)
			//
			case Input.IsPressed(InputAction.GAME_A):
			case Input.IsPressed(InputAction.GAME_C):
				if(App.Game.Stage < Const.MAX_STAGE)
				{
					App.Game.Stage++;
				}
				break;

			//
			// 减关数 (按住GAME_B或GAME_D键)
			//
			case Input.IsPressed(InputAction.GAME_B):
			case Input.IsPressed(InputAction.GAME_D):
				if(App.Game.Stage > 1)
				{
					--App.Game.Stage;
				}
				break;

			//
			// 开始 (START键)
			//
			case Input.IsPressed(InputAction.START):
				++T;
				break;
			}
		}
		else if(T == 22)
		{
			//
			// 恢复显示敌人标志
			//
			for(var i = 0; i < 20; ++i)
				this.EnemyFlag[i].show();

			App.Game.FirstStart = false;
			App.Game.NewStage();			// 创建新关
		}
		else if(T < 80)
		{
			// 稍作停顿
		}
		else if(T == 80)
		{
			this._lalStage.hide();				// 隐藏 -关数界面
			this._layInfo.hide();				// 暂时隐藏信息栏
		}
		else if(T <= 100)
		{
			this._arrMask[0].moveBy(0, -12);	// 银幕拉开
			this._arrMask[1].moveBy(0, +12);
		}
		else if(T == 101)
		{
			this._layInfo.show();				// 显示 -信息栏
			//this._oSound.Play();
		}

		return T;
	}
});






