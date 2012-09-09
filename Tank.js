
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
 * 子弹类
 ****************************************/

/**
 * 子弹状态机
 * @enum {number}
 */
var BullState =
{
	NONE: 0,
	FIRE: 1,
	BOOM: 2,
	RESET: 3
};


/**
 * 子弹移动状态
 * @enum {number}
 */
var HitState =
{
	NONE: 0,
	HIT: 1,
	MISS: 2
};




var Bullet = Class(
{
	_state: BullState.NONE,	// 状态机
	_team: 0,				// 队伍
	_sptBul: null,
	_boom: null,


	X:0, Y:0,		// 位置
	Dir:0,			// 方向
	Speed:0,		// 速度
	Pow:0,			// 是否加强子弹


    static  :{className:"Bullet"},
	constructor: function(team)
	{
		//
		// 创建子弹精灵
		//
		this._sptBul = new Sprite("res/Misc.png", 8, 8);
		this._sptBul.hide();
		this._sptBul.setZ(Const.Z_BULL);
		App.GameUI.append(this._sptBul);

		// 子弹所属的队伍
		this._team = team;

		// 小型爆炸
		this._boom = new Boom(false);
	},


	/**
	 * 子弹逻辑更新
	 */
	Update: function()
	{
		switch(this._state)
		{
		case BullState.NONE:			// -空闲状态
			break;

		case BullState.FIRE:			// -发射状态
			for(var i = 0; i < this.Speed; ++i)
			{
				switch(this._Go())
				{
				//
				// 击中物体，子弹爆炸
				//
				case HitState.HIT:
					this._boom.Start(this.X - 28, this.Y - 28);
					this._state = BullState.BOOM;
					return;

				//
				// 子弹消失
				//
				case HitState.MISS:
					this._state = BullState.RESET;
					return;
				}

				switch(this.Dir)
				{
				case 0:		//上
					this.y -= 2;
					break;
				case 1:		//右
					this.x += 2;
					break;
				case 2:		//下
					this.y += 2;
					break;
				case 3:		//左
					this.x -= 2;
					break;
				}

				// 更新子弹位置
				this._sptBul.move(Const.POS_X + this.x, Const.POS_Y+ this.y);
			}
			break;

		case BullState.BOOM:			// -爆炸状态
			if(this._boom.Update())
				this._state = BullState.RESET;
			break;

		case BullState.RESET:			// -重置状态
			this._sptBul.Hide();
			this._state = BullState.NONE;
			break;
		}
	},


	/**
	 * 返回子弹是否为空闲
	 */
	IsIdle: function()
	{
		return this._state == BullState.NONE;
	},


	/**
	 * 发射子弹
	 */
	Shot: function(x, y, dir)
	{
		//
		// 调整子弹到坦克前方的位置
		//
		switch(dir)
		{
		case 0:		//上
			x += 12;
			y -= 8;
			break;
		case 1:		//右
			x += 32;
			y += 12;
			break;
		case 2:		//下
			x += 12;
			y += 32;
			break;
		case 3:		//左
			x -= 8;
			y += 12;
			break;
		}

		this._sptBul.move(Const.POS_X + x, Const.POS_Y + y);
		this._sptBul.setFrame(dir);		//设置方向
		this._sptBul.show();

		this.X = x;
		this.Y = y;
		this.Dir = dir;

		this._state = BullState.FIRE;
	},


	/**
	 * 重置子弹
	 */
	Reset: function()
	{
		this._sptBul.Hide();
		this._boom.Reset();

		this._state = BullState.NONE;
	},


	/**
	 * 子弹移动
	 */
	_Go: function()
	{
		/**
		 * 返回值
		 *   0：子弹继续前进
		 *   1: 子弹碰到物体
		 *   2：子弹抵消
		 */
		var ret = HitState.NONE;

		var p, q, r;
		var b1, b2;

		var B = App.Scene.Block;
		var x = this.X;
		var y = this.Y;


		/**
		 * 子弹击中砖块（向上的情况）：
		 *
		 * ||===========||===========||
		 * ||     |     ||     |     ||
		 * ||---- ? ----||---- ? ----||
		 * ||     |     ||     |     ||
		 * ||===========||===========||
		 * ||  1  |  2  ||  1  |  2  ||
		 * ||---- L ----||---- R ----||
		 * ||  4  |  8  ||  4  |  8  ||
		 * ||===========||===========||
		 *              /\
		 *             /  \ 
		 *             |__|
		 *
		 *  L => block[r][p]  (左边的block)
		 *  R => block[r][q]  (右边的block)
		 *
		 *  击中砖块的同时，
		 *  可以消去同方向的另一砖块。
		 *
		 *  普通子弹：
		 *      击中L的8号砖，则L的4号砖也同时消去（如果存在的话）；
		 *      如果不存在8号，4号则不受影响；
		 *
		 *      击中L的8号砖之后，如果R是铁块，子弹停止；
		 *      否则子弹继续向上，检测L的2号和1号。
		 *      （一次打掉半个block砖）
		 *
		 *  加强子弹：
		 *      ...
		 *
		 *      击中L的8号砖之后，不论R是否为铁块，子弹都将继续。
		 *      （一次可以打掉一个block砖）
		 *
		 *
		 *  另一边同理。
		 *  其他方向的子弹同理。
		 */
		switch(this.Dir)
		{
		/******************************************
		 * 子弹: 上
		 *****************************************/
		case 0:
			// 以子弹尾部为准
			y += 8;

			// 飞出视野
			if(y <= 0)
				return 1;

			// 没有和地块接触
			if(y % 16)
				break;

			r = y / 16 - 1;
			p = x >> 4;			// p = Math.floor(x / 16)
			q = p + 1;

			b1 = B[r][p];	// 左
			b2 = B[r][q];	// 右

			if(b1 & 0xF)
				ret	= this._TileHit(b1, b2, p, r, 8, 4, 2, 1);
			if(b2 & 0xF)
				ret |= this._TileHit(b2, b1, q, r, 4, 8, 1, 2);
			break;

		/******************************************
		 * 子弹: 右
		 *****************************************/
		case 1:
			if(x >= 416)
				return 1;

			if(x % 16)
				break;

			r = x / 16;
			p = y >> 4;
			q = p + 1;

			b1 = B[p][r];	// 上
			b2 = B[q][r];	// 下

			if(b1 & 0xF)
				ret = this._TileHit(b1, b2, r, p, 4, 1, 8, 2);
			if(b2 & 0xF)
				ret |= this._TileHit(b2, b1, r, q, 1, 4, 2, 8);
			break;

		/******************************************
		 * 子弹: 下
		 *****************************************/
		case 2:
			if(y >= 416)
				return 1;

			if(y % 16)
				break;

			r = y / 16;
			p = x >> 4;
			q = p + 1;

			b1 = B[r][p];	// 左
			b2 = B[r][q];	// 右

			if(b1 & 0xF)
				ret = this._TileHit(b1, b2, p, r, 2, 1, 8, 4);
			if(b2 & 0xF)
				ret |= this._TileHit(b2, b1, q, r, 1, 2, 4, 8);
			break;

		/******************************************
		 * 子弹: 左
		 *****************************************/
		case 3:
			x += 8;

			if(x <= 0)
				return 1;

			if(x % 16)
				break;

			r = x / 16 - 1;
			p = y >> 4;
			q = p + 1;

			b1 = B[p][r];	// 上
			b2 = B[q][r];	// 下

			if(b1 & 0xF)
				ret = this._TileHit(b1, b2, r, p, 8, 2, 4, 1);
			if(b2 & 0xF)
				ret |= this._TileHit(b2, b1, r, q, 2, 8, 1, 4);
			break;
		}


		//
		// 检测铁块是否能打掉
		//
		if(b1 == Const.BLOCK_IRON)
		{
			ret = HitState.HIT;
			if(this.Pow)
			{
				if(this.Dir==1 || this.Dir==3)
					App.Scene.SetIronFrag(r, p, Const.BLOCK_NONE);	// 横向
				else
					App.Scene.SetIronFrag(p, r, Const.BLOCK_NONE);	// 纵向
			}
		}

		if(b2 == Const.BLOCK_IRON)
		{
			ret = HitState.HIT;
			if(this.Pow)
			{
				if(this.Dir==1 || this.Dir==3)
					App.Scene.SetIronFrag(r, q, Const.BLOCK_NONE);	// 横向
				else
					App.Scene.SetIronFrag(q, r, Const.BLOCK_NONE);	// 纵向
			}
		}


		//
		// 是否打到总部
		//
		if(b1 == Const.BLOCK_BASE1 || b2 == Const.BLOCK_BASE1)
		{
			App.Game.BaseDestroy();
			ret = HitState.HIT;
		}


		//
		// 碰撞检测
		//
		var tanks = App.Scene.Tanks;
		var tank, bul;
		var i, j;

		for(i = 0; i < Const.MAX_TANK; ++i)
		{
			tank = tanks[i];

			//
			// 跳过同一队伍的
			//
			if(tank.Team == this._team || !tank.IsLive())
				continue;

			//
			// 子弹与坦克的碰撞
			//
			if(tank.CheckColl(this._sptBul))
			{
				if(HitState.MISS == tank.Hit())	// 打到防弹衣
					return HitState.MISS;
				else							// 打到坦克（不一定要打爆）
					return HitState.HIT;
			}

			//
			// 与对方坦克的子弹碰撞
			//
			for(j = 0; j < tank.BulMax; j++)
			{
				bul = tank.Bullets[j];

				if(bul._state == BullState.FIRE)
				{
					if(bul._sptBul.collidesWith(this._sptBul))
					{
						// 对家的子弹也消失
						bul._state = BullState.RESET;
						return HitState.MISS;
					}
				}
			}
		}

		return ret;
	},


	/**
	 * 子弹与砖块的撞击
	 */
	_TileHit: function(b1, b2, col, row, p1, p2, q1, q2)
	{
		var hit = 0;

		if(b1 & p1)
		{
			b1 &= ~p1;			// 当前块
			if(b1 & p2)			// 同方向扩散
				b1 &= ~p2;
			hit = 1;
		}

		if(b1 & q1)				// 后面块
		{
			/**
			 * 加强子弹可以一次打两层砖。
			 * 普通子弹只有前面块不存在，
			 *    并且旁边不是铁块，
			 *    才可以打后面块。
			 */
			if(this.Pow || (hit == 0 && b2 != Const.BLOCK_IRON))
			{
				b1 &= ~q1;
				if(b1 &= q2)	// 同方向扩散
					b1 &= ~q2;
				hit = 1;
			}
		}

		if(hit)
			App.Scene.SetTileFrag(col, row, b1);

		return hit;
	}
});









/**
 * 游戏常量声明
 * @enum
 */
var Const =
{
	//
	// 游戏常量
	//
	MAX_STAGE: 35,				// 总关数
	MAX_TANK: 5,				// 最大坦克数

	TIME_BULPRF_DEF: 250,		// 出生防弹时间
	TIME_BULPRF_BONUS: 1200,	// 奖励防弹时间
	TIME_WALL_IRON: 1200,		// 总部铁墙保护时间


	//
	// 带奖励的红坦克（默认：4号，11号，18号）
	//
	// ------- 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20
	BONUS_MAP: [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0],


	//
	// 场景位置
	//
	POS_X: 34,
	POS_Y: 18,


	//
	// 场景图层深度
	//
	Z_MAP:		0,		// 地图
	Z_FRAG:		1,		// 碎片砖
	Z_BULL:		2,		// 子弹
	Z_TANK:		3,		// 坦克
	Z_GRASS:	4,		// 草
	Z_SCORE:	5,		// 分数（与坦克共用一个层）
	Z_BONUS:	6,		// 奖励图标
	Z_BOOM:		7,		// 爆炸
	Z_UI:		8,		// 相关界面

	//
	// block障碍值
	//
	BLOCK_NONE: 0,
	BLOCK_TILE: 15,
	BLOCK_ICE: 16,
	BLOCK_IRON: 32,
	BLOCK_WATER: 64,
	BLOCK_BASE1: 128,
	BLOCK_BASE2: 256,


	//
	// 精灵帧序列基值
	//
	FR_BIRTH: 112,
	FR_SCORE: 116,
	FR_BONUS: 121,
	FR_BULPRF: 11
};




/****************************************
 * 坦克类
 ****************************************/

/**
 * 坦克状态机
 * @enum {number}
 */
var TankState =
{
	NONE: 0,
	BIRTH: 1,
	LIVE: 2,
	BOOM: 3,
	SCORE: 4,
	RESET: 5
};



var Tank = Class({
	static:
	{
		BIRTH: Misc.ARR(Const.FR_BIRTH, 0,1,2,3,2,1,0,1,2,3,2,1,0),
		BULPRF: Misc.ARR(Const.FR_BULPRF, 0, 0, 1, 1),
		className:"Tank"
	},

	_state: TankState.NONE,	// 状态机
	_icon: 0,				// 坦克图标
	_wheel: 0,				// 轮子状态 (0 -> 1 -> 0)
	_type: 0,				// 类型


	_tickBirth: null,		// 生产动画计时器


	_sptTank: null,			// 坦克精灵
	_boom: null,			// 爆炸


	_timerFire: 0,			// 开火计时器
	_fireDelay: 16,			// 开火最短间隔

	_tickMove: null,		// 移动计时器


	X:0, Y:0,				// 坐标
	Speed: 0,				// 移动速度
	Dir: -1,				// 当前方向
	Team: 0,				// 队伍

	Bullets: null,			// 子弹数组
	BulMax: 0,				// 最大子弹数



	constructor: function(team)
	{
		//
		// 创建坦克精灵
		//
		this._sptTank = new Sprite("res/Tank.png", 32, 32);
		this._sptTank.hide();
		App.GameUI.append(this._sptTank);

		// 队伍
		this.Team = team;

		// 子弹数组
		this.Bullets = [];

		// 大的爆炸对象
		this._boom = new Boom(true);

		// 定时器
		this._tickMove = new Tick(2);
	},


	Update: function()
	{
		this._timerFire--;

		//
		// 更新发出的子弹
		//
		for(var i = 0; i < this.BulMax; ++i)
			this.Bullets[i].Update();

		//
		// 坦克状态机
		//
		switch(this._state)
		{
		/*========================================
		 * 状态: 无
		 ========================================*/
		case TankState.NONE:
			break;

		/*========================================
		 * 状态: 坦克生产过程
		 ========================================*/
		case TankState.BIRTH:
			if(!this._tickBirth.On())
				return;

			//
			// 显示坦克精灵
			//
			if(!this._sptTank.Visible)
			{
				this._sptTank.show();
				this._sptTank.setZ(Const.Z_TANK);
			}

			// 播放生产动画
			this._sptTank.nextFrame();

			//
			// 生产完成，进入运行状态
			//
			if(this._sptTank.getFrame() == 0)
			{
				// 撤销生产动画的帧序列
				this._sptTank.setFrameSeq();

				this._state = TankState.LIVE;
				this.SetType(this._type);
			}
			break;

		/*========================================
		 * 状态: 坦克生运行中
		 ========================================*/
		case TankState.LIVE:
			this._UpdateUI();
			break;

		/*========================================
		 * 状态: 坦克爆炸
		 ========================================*/
		case TankState.BOOM:
			if(this._boom.Update())
				this._Boom();
			break;

		/*========================================
		 * 状态: 显示得分
		 ========================================*/
		case TankState.SCORE:
			if(this._tickScore.On())
				this._state = TankState.RESET;
			break;

		/*========================================
		 * 状态: 销毁
		 ========================================*/
		case TankState.RESET:
			this._sptTank.Hide();	// 隐藏坦克精灵
			this._state = TankState.NONE;
			break;
		}
	},


	/**
	 * 返回坦克是否活动
	 */
	IsLive: function()
	{
		return this._state == TankState.LIVE;
	},


	/**
	 * 返回坦克对象是否空闲
	 */
	IsIdle: function()
	{
		return this._state == TankState.NONE;
	},


	/**
	 * 检测坦克精灵是否与指定的层重叠
	 */
	CheckColl: function(layer)
	{
		return this._sptTank.collidesWith(layer);
	},


	/**
	 * 子弹击中坦克
	 */
	Hit: function(force)
	{
		var ret = this._Hit(force);

		if(HitState.HIT == ret)
		{
			//
			// 坦克开始爆炸
			//
			this._boom.Start(this.X - 16, this.Y - 16);

			this._state = TankState.BOOM;
		}

		return ret;
	},


	/**
	 * 设置坦克类型
	 */
	SetType: function(t)
	{
		this._type = t;

		if(this._state != TankState.LIVE)
			return;

		this._SetType(t);
		this._UpdateFrame();
	},


	/**
	 * 设置坐标
	 */
	SetPos: function(x, y)
	{
		// 设置坦克位置
		this._sptTank.move(Const.POS_X + x, Const.POS_Y + y);
		this.x = x;
		this.y = y;
	},


	/**
	 * 设置方向
	 */
	SetDir: function(val)
	{
		if(this.Dir == val)
			return;

		//
		// 转弯时调整位置，使更灵活
		//
		var fix;
		switch(this.Dir)
		{
		case 0:			// 当前处于上下方向，调整y值到最近block单元位置
		case 2:
			if(this.Y % 16)
			{
				this.Y = Math.round(this.Y / 16) * 16;
				fix = true;
			}
			break;
		case 1:			// 当前处于左右方向，调整x值到最近block单元位置
		case 3:
			if(this.X % 16)
			{
				this.X = Math.round(this.X / 16) * 16;
				fix = true;
			}
			break;
		}

		this.Dir = val;

		if(fix)
		{
			this._sptTank.move(Const.POS_X + this.X, Const.POS_Y + this.Y);
			this._UpdateFrame();
		}
	},


	/**
	 * 发射一枚子弹
	 */
	Fire: function()
	{
		if(this._timerFire > 0)
			return;

		//
		// 找出一空闲子弹并发射
		//
		var i, bul;
		for(i = 0; i < this.BulMax; ++i)
		{
			bul = this.Bullets[i];

			if(bul.IsIdle())
			{
				bul.Shot(this.X, this.Y, this.Dir);
				this._timerFire = this._fireDelay;
				break;
			}
		}
	},


	/**
	 * 当前方向前进一步
	 */
	Go: function()
	{
		//
		// 移动间隔计时器
		//
		if(!this._tickMove.On())
			return true;

		this._tickMove.Reset(3 - this.Speed);


		var tanks = App.Scene.Tanks;
		var x = this.X;
		var y = this.Y;
		var x2, y2;

		var col = x >> 4;	// Math.floor(x / 16)
		var row = y >> 4;	// Math.floor(y / 16)
		var offset, i;
		var tank;


		// 切换轮子的状态 0->1->0
		this._wheel = +!this._wheel;
		this._UpdateFrame();


		switch(this.Dir)
		{
		/******************************
		 * 上移
		 *****************************/
		case 0:
			if(y == 0)
				return false;

			//
			// 检测上方是否有阻碍块
			//
			if(y % 16 == 0)
			{
				if(!this._MoveTest(col, row-1, col+1, row-1))
					return false;
			}

			/*
			 * 坦克与坦克的碰撞检测。
			 *
			 * 如果诞生时该位置已存在坦克，
			 * 此时可以重叠，并且可以移动，
			 * 一旦分开后就不可再重叠。
			 */
			for(i = 0; i < Const.MAX_TANK; ++i)
			{
				tank = tanks[i];
				if(tank != this && tank.IsLive())
				{
					offset = tank.Y + 32 - y;
					x2 = tank.X;

					if(0 <= offset && offset <= 6 && x2 - 32 < x && x < x2 + 32)
						return false;
				}
			}

			y -= 2;
			break;
		/******************************
		 * 右移
		 *****************************/
		case 1:
			if(x == 384)	//12*32
				return false;

			if(x % 16 == 0)
			{
				if(!this._MoveTest(col+2, row, col+2, row+1))
					return false;
			}

			for(i = 0; i < Const.MAX_TANK; ++i)
			{
				tank = tanks[i];
				if(tank != this && tank.IsLive())
				{
					offset = x + 32 - tank.X;
					y1 = tank.Y;

					if(0 <= offset && offset <= 6 && y1 - 32 < y && y < y1 + 32)
						return false;
				}
			}

			x += 2;
			break;
		/******************************
		 * 下移
		 *****************************/
		case 2:
			if(y == 384)
				return false;

			if(y % 16 == 0)
			{
				if(!this._MoveTest(col, row+2, col+1, row+2))
					return false;
			}

			for(i = 0; i < Const.MAX_TANK; ++i)
			{
				tank = tanks[i];
				if(tank != this && tank.IsLive())
				{
					offset = y + 32 - tank.Y;
					x1 = tank.X;

					if(0 <= offset && offset <= 6 && x1 - 32 < x && x < x1 + 32)
						return false;
				}
			}

			y += 2;
			break;
		/******************************
		 * 左移
		 *****************************/
		case 3:
			if(x == 0)
				return false;

			if(x % 16 == 0)
			{
				if(!this._MoveTest(col-1, row, col-1, row+1))
					return false;
			}

			for(i = 0; i < Const.MAX_TANK; ++i)
			{
				tank = tanks[i];
				if(tank != this && tank.IsLive())
				{
					offset = tank.X + 32 - x;
					y1 = tank.Y;

					if(0 <= offset && offset <= 6 && y1 - 32 < y && y < y1 + 32)
						return false;
				}
			}

			x -= 2;
			break;
		}

		this.X = x;
		this.Y = y;
		this._sptTank.move(Const.POS_X + x, Const.POS_Y + y);

		return true;
	},


	/**
	 * 生产坦克
	 */
	Birth: function()
	{
		// 进入产生状态
		this._state = TankState.BIRTH;

		this._sptTank.setFrameSeq(Tank.BIRTH);
	},


	/**
	 * 重置坦克对象
	 */
	Reset: function()
	{
		this._Reset();

		//
		// 复位所有子弹
		//
		for(var i = 0; i < this.BulMax; ++i)
			this.Bullets[i].Reset();

		// 复位爆炸对象
		this._boom.Reset();

		//
		// 计时器复位
		//
		this._tickMove.Reset(2);
		this._timerFire = 0;

		// 隐藏精灵
		this._sptTank.Hide();

		// 状态复位
		this._state = TankState.NONE;
	},


	/**
	 * 更新坦克界面
	 */
	_UpdateFrame: function()
	{
		this._sptTank.setFrame(this.Dir * 28 + this._wheel * 14 + this._icon);
	},


	/**
	 * 配置子弹参数
	 */
	_SetBullets: function(max, speed, pow)
	{
		var i, bul;

		//
		// 将属性配置到每一个子弹对象
		//
		for(i = 0; i < max; ++i)
		{
			bul = this.Bullets[i];
			if(!bul)
				bul = this.Bullets[i] = new Bullet(this.Team);

			bul.Speed = speed;
			bul.Pow = pow;
		}

		this.BulMax = max;
	},


	/**
	 * 前进时地形障碍检测
	 */
	_MoveTest: function(c1, r1, c2, r2)
	{
		var B = App.Scene.Block;
		var b1 = B[r1][c1];
		var b2 = B[r2][c2];

/*
		return (b1 == Const.BLOCK_NONE || b1 == Const.BLOCK_ICE) &&
			   (b2 == Const.BLOCK_NONE || b2 == Const.BLOCK_ICE);
*/
		// BLOCK_NONE=0;  
		// BLOCK_ICE=16; =>
		return (b1|16)==16 && (b2|16)==16;
	}
});

/****************************************
 * 玩家坦克类
 ****************************************/
var MyTank =function(){return  Class(Tank,
{   static:{className:"MyTank"},
	_sptBulprf: null,		// 防弹衣精灵
	_timerBulprf: 0,		// 防弹时间



	constructor: function()
	{

		this.Tank(0);	// super

		//
		// 创建防弹衣精灵
		//
		this._sptBulprf = new Sprite("res/Misc.png", 32, 32);
		this._sptBulprf.hide();
		this._sptBulprf.setFrameSeq(Tank.BULPRF);
		this._sptTank.append(this._sptBulprf);

		this._tickBirth = new Tick(2);
	},


	/**
	 * 覆盖 -- 界面更新
	 */
	_UpdateUI: function()
	{
		--this._timerBulprf;

		//
		// 更新防弹衣动画
		//
		if(this._timerBulprf > 0)
		{
			this._sptBulprf.show();
			this._sptBulprf.nextFrame();
		}
		else if(this._timerBulprf == 0)
		{
			this._sptBulprf.hide();
		}
	},


	/**
	 * 覆盖 -- 设置类型
	 */
	_SetType: function(t)
	{
		this.Speed = 2;

		switch(t)
		{
		case 0:		// 普通
			this._fireDelay = 13;
			this._SetBullets(1, 2, false);
			break;

		case 1:		// 快速
			this._fireDelay = 11;
			this._SetBullets(1, 3, false);
			break;

		case 2:		// 连发
			this._fireDelay = 7;
			this._SetBullets(2, 3, false);
			break;

		case 3:		// 威力
			this._fireDelay = 7;
			this._SetBullets(2, 3, true);
			break;
		}

		this._icon = t;
	},


	/**
	 * 覆盖 -- 坦克被击中
	 */
	_Hit: function()
	{
		if(this._timerBulprf > 0)
		{
			return HitState.MISS;
		}
		else
		{
			this._sptTank.hide();
			return HitState.HIT;
		}
	},


	/**
	 * 覆盖 -- 坦克爆炸
	 */
	_Boom: function()
	{
		this.SetType(0);

		// 减少1条命
		App.Game.LifeDec();

		this._state = TankState.RESET;
	},


	/**
	 * 覆盖 -- 坦克重置
	 */
	_Reset: function()
	{
		//
		// 停止防弹状态
		//
		if(this._timerBulprf > 0)
		{
			this._timerBulprf = 0;
			this._sptBulprf.Hide();
		}
	},


	/**
	 * 开启防弹衣
	 */
	StartBulProof: function(t)
	{
		this._timerBulprf = t;
	},


	/**
	 * 坦克升级
	 */
	Upgrade: function()
	{
		if(this._type < 3)
			this.SetType(this._type + 1);
	},


	/**
	 * 返回是否位于冰上
	 */
	OnIce: function()
	{
		// Math.floor(x / 16)
		return Const.BLOCK_ICE ==
				App.Scene.GetBlock4x4(this.X >> 4, this.Y >> 4);
	}
});
};


/****************************************
 * 电脑坦克类
 ****************************************/
var NPCTank =function(){ return Class(Tank,
{   static:{className:"NPCTank"},
	_bonus: false,			// 是否带奖励
	_HP: 0,					// 生命值

	_tickRed: null,			// 奖励闪烁计时器
	_statRed: null,
	_tickFlash: null,
	_tickScore: null,		// 奖励加分计时器




	constructor: function()
	{
		this.Tank(1);	// super


		this._tickRed = new Tick(10);
		this._statRed = new Tick(2);

		this._tickScore = new Tick(10);
		this._tickFlash = new Tick(2);

		this._tickBirth = new Tick(5);
	},


	/**
	 * 覆盖 -- 界面更新
	 */
	_UpdateUI: function()
	{
		//
		// 更新带奖励的NPC颜色
		//
		if(this._bonus)
		{
			if(this._tickRed.On())
			{
				this._statRed.On()? --this._icon : ++this._icon;
				this._UpdateFrame();
			}

			return;
		}

		//
		// 加强型坦克颜色
		//
		if(this._type == 3)
		{
			switch(this._HP)
			{
			case 1:		//白
				this._icon = 10;
				break;
			case 2:		//黄-绿
				this._icon = this._tickFlash.On()? 13 : 12;
				break;
			case 3:		//黄-白
				this._icon = this._tickFlash.On()? 13 : 10;
				break;
			case 4:		//绿-白
				this._icon = this._tickFlash.On()? 12 : 10;
				break;
			}
		}

		this._UpdateFrame();
	},


	/**
	 * 覆盖 -- 设置类型
	 */
	_SetType: function(t)
	{
		this.Speed = 1;

		switch(t)
		{
		case 0:		// 普通型
			this._icon = 4;
			this._HP = 1;
			this._SetBullets(1, 2, false);
			break;

		case 1:		// 灵活型
			this._icon = 6;
			this.Speed = 2;
			this._HP = 1;
			this._SetBullets(1, 2, false);
			break;

		case 2:		// 威力型
			this._icon = 8;
			this._HP = 1;
			this._SetBullets(1, 3, false);
			break;

		case 3:		// 加强型
			this._icon = 10;
			this._HP = 4;
			this._SetBullets(1, 2, false);
			break;
		}
	},


	/**
	 * 覆盖 -- 坦克被击中
	 */
	_Hit: function(force)
	{
		//
		// 接到炸弹强制爆炸
		//   如果带奖励则丢失
		//
		if(force)
		{
			this._HP = -1;
			this._bonus = false;

			this._sptTank.Hide();
			return HitState.HIT;
		}

		//
		// 显示奖励
		//
		if(this._bonus)
		{
			this._bonus = false;
			App.Scene.Bonus.Show();
		}

		if(--this._HP == 0)
		{
			//
			// 加分（100,200,300,400）
			//
			App.Game.SocreAdd(100 * (this._type + 1));

			//
			// 显示得分（分数图标位于草的上层）
			//
			this._sptTank.SetFrame(Const.FR_SCORE + this._type);
			this._sptTank.SetZ(Const.Z_SCORE);

			return HitState.HIT;
		}

		return HitState.NONE;
	},


	/**
	 * 覆盖 -- 坦克爆炸
	 */
	_Boom: function()
	{
		//
		// 被炸掉的不显示分数，也不类型计数
		//
		if(this._HP == -1)
		{
			this._state = TankState.RESET;
			App.Game.KillEnemy(-1);
		}
		else
		{
			this._state = TankState.SCORE;
			App.Game.KillEnemy(this._type);
		}
	},


	/**
	 * 覆盖 -- 坦克重置
	 */
	_Reset: function()
	{
		// 撤销奖励
		this._bonus = false;

		this._tickRed.Reset();
		this._tickScore.Reset();
	},


	/**
	 * 设置是否带奖励
	 */
	HasBonus: function()
	{
		this._bonus = true;
		this._statRed.Reset();
	}
});
};

/****************************************
 * 爆炸类
 ****************************************/
var Boom = Class(
{
	_big: false,
	_start: false,
	_sptBoom: null,
	_tickBoom: null,


    static:{className:Boom},
	constructor: function(big)
	{
		// 创建爆炸精灵
		this._sptBoom = new Sprite("res/Boom.png", 64, 64);
		this._sptBoom.hide();
		this._sptBoom.setZ(Const.Z_BOOM);
		this._sptBoom.setFrameSeq(big ? [0,1,2,3,4,1] : [0,1]);
		App.GameUI.append(this._sptBoom);


		this._big = big;
		this._tickBoom = new Tick(4);
	},


	Update: function()
	{
		if(!this._start)
			return;

		// 大的爆炸过程中稍作延时
		if(this._big && !this._tickBoom.On())
			return;

		// 显示爆炸动画帧
		this._sptBoom.nextFrame();

		// 爆炸结束
		if(this._sptBoom.GetFrame() == 0)
		{
			this._sptBoom.Hide();
			this._start = false;
			return true;
		}
	},


	Start: function(x, y)
	{
		// 定位爆炸精灵
		this._sptBoom.Move(Const.POS_X + x, Const.POS_Y + y);

		// 开始播放爆炸动画
		this._sptBoom.Show();
		this._start = true;
	},


	Reset: function()
	{
		// 重置爆炸对象
		this._sptBoom.Hide();
		this._tickBoom.Reset();
		this._start = false;
	}
});


/****************************************
 * 技能奖励类
 ****************************************/

/**
 * 奖励状态机
 * @enum {number}
 */
var BonusState =
{
	NONE: 0,
	SHOW: 1,
	SCORE: 2
};


var Bonus = Class(
{
	_sptIcon: null,					// 奖励精灵
	_state: BonusState.NONE,		// 状态机
	_type: 0,						// 0-铲子 1-五角星 2-加命 3-防弹 4-炸弹 5-定时


	_tickFlash: null,				// 图标闪烁间隔
	_statFlash: null,				// 图标闪烁状态

	_tickToggle: null,				// 总部切换间隔
	_statToggle: null,				// 总部切换状态

	_tickScore: null,				// 分数显示时间

	_timerProtect: 0,				// 总部防护时间计时
	_timerFreeze: 0,				// 定时技能计时


    static:{className:Bonus},
	constructor: function()
	{
		//
		// 创建精灵
		//
		this._sptIcon = new Sprite("res/Tank.png", 32, 32);
		this._sptIcon.hide();
		this._sptIcon.setZ(Const.Z_BONUS);
		App.GameUI.append(this._sptIcon);


		//
		// 相关定时器
		//
		this._tickFlash = new Tick(10);
		this._statFlash = new Tick(2);		// 2态计数器，在true和false间切换。

		this._tickToggle = new Tick(30);
		this._statToggle = new Tick(2);

		this._tickScore = new Tick(20);
	},


	/**
	 * 逻辑更新
	 */
	Update: function()
	{
		this._timerProtect--;
		this._timerFreeze--;

		/*
		 * 铁锹保护倒计时
		 *
		 * 在快结束前时间内，
		 * 总部围墙在 铁块 和 砖块 间切换。
		 * 即使已没有围墙，也补上
		 */
		if(0 <= this._timerProtect && this._timerProtect < 330)
		{
			// 切换定时器
			if(this._tickToggle.On())
				this._SetBaseWall(this._statToggle.On());
		}

		//
		// 更新状态机
		//
		switch(this._state)
		{
		case BonusState.NONE:	// -奖励没有出现
			break;

		case BonusState.SHOW:	// -奖励出现，等待玩家去接
			// 奖励闪烁定时器
			if(this._tickFlash.On())
				this._sptIcon.SetVisible(this._statFlash.On());

			this._CheckBonus();
			break;

		case BonusState.SCORE:	// -显示奖励分数
			if(this._tickScore.On())
				this.Clear();
			break;
		}
	},


	/**
	 * 显示奖励
	 */
	Show: function()
	{
		var rnd = Math.random;
		this._type = rnd() * 6 >> 0;

		//
		// 奖励出现在地图上可进入的位置
		//
		var c, r;
		do
		{
			c = rnd() * 24 >> 0;
			r = rnd() * 24 >> 0;
		}
		while(App.Scene.GetBlock4x4(c, r) >= Const.BLOCK_IRON)

		//
		// 显示奖励图标
		//
		this._sptIcon.setFrame(Const.FR_BONUS + this._type);
		this._sptIcon.move(Const.POS_X + c * 16, Const.POS_Y + r * 16);
		this._sptIcon.show();

		this._state = BonusState.SHOW;
	},


	/**
	 * 当前是否处于定时
	 */
	IsFreezed: function()
	{
		return this._timerFreeze > 0;
	},


	/**
	 * 清空奖励
	 */
	Clear: function()
	{
		this._sptIcon.hide();
		this._state = BonusState.NONE;
	},


	/**
	 * 重置奖励
	 */
	Reset: function()
	{
		this.Clear();

		// 复位计数器
		this._tickScore.Reset();

		this._timerFreeze = 0;
		this._timerProtect = 0;
	},



	/**
	 * 获得奖励
	 */
	_CheckBonus: function()
	{
		var i, player = App.Scene.Tanks[0];

		//
		// 玩家是否碰到奖励
		//
		if(!player.IsLive() || !player.CheckColl(this._sptIcon))
			return;

		switch(this._type)
		{
		case 0:		// 铲子
			this._timerProtect = Const.TIME_WALL_IRON;
			this._statToggle.Reset();
			this._SetBaseWall(true);
			break;

		case 1:		// 升级
			player.Upgrade();
			break;

		case 2:		// 加命
			App.Game.LifeInc();
			break;

		case 3:		// 防弹
			player.StartBulProof(Const.TIME_BULPRF_BONUS);
			break;

		case 4:		// 炸弹
			for(i = 1; i < Const.MAX_TANK; ++i)
			{
				if(App.Scene.Tanks[i].IsLive())
					App.Scene.Tanks[i].Hit(true);	//强制爆炸
			}
			break;

		case 5:		// 定时
			this._timerFreeze = 1000;
			break;
		}

		// 奖励500分
		App.Game.SocreAdd(500);

		// 取消闪烁
		this._sptIcon.Show();
		this._sptIcon.SetFrame(Const.FR_SCORE + 4);

		this._state = BonusState.SCORE;
	},


	/**
	 * 设置总部围墙
	 */
	_SetBaseWall: function(iron)
	{
		var skip = iron? 0 : 0xF;

		//-------------------x--y---tile
		App.Scene.SetMapCell(5, 11, 14 + skip);		// 上-左
		App.Scene.SetMapCell(6, 11, 18 + skip);		// 上-中
		App.Scene.SetMapCell(7, 11, 10 + skip);		// 上-右

		App.Scene.SetMapCell(5, 12, 16 + skip);		// 左
		App.Scene.SetMapCell(7, 12, 11 + skip);		// 右
	}
});























