var Misc = 
{
	/**
	 * �������ÿ����Ա����baseֵ
	 *   ����֡��ŵ����ֵ����
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
 * ��������ģ��
 ****************************************/
var UIOpen = Class(Layer,
{
	_lalScore: null,		// ���˷���
	_sptSel: null,			// ѡ��ͼ��

	_tickSel: null,



	/**
	 * ���캯�� - ������������
	 */
	constructor: function()
	{
		//this.Layer();		

		this._tickSel = new Tick(5);


		var spt, lal;

		// ��������
		this._lalScore = new Lable();
		this._lalScore.move(36, 48);
		this._lalScore.setColor("#FFF");
		this.append(this._lalScore);

		this.DispScore();

		// LOGO
		spt = new Sprite("res/UI.png", 376, 160);
		spt.move(56, 96);
		this.append(spt);

		// ѡ������
		lal = new Lable();
		lal.move(178, 272);
		lal.setText("1  PLAYER\n2  PLAYERS\nCONSTRUCTION");
		lal.setColor("#FFF");
		this.append(lal);

		// ѡ��ͼ��
		this._sptSel = new Sprite("res/Tank.png", 32, 32);
		this._sptSel.move(130, 272);
		this._sptSel.setFrameSeq([28, 42]);
		this.append(this._sptSel);
	},


	OnEnter: function()
	{
		// ��ʾ-������
		this.show();
		this.setY(448);

		// ���������в���ʾ̹��ͼ��
		this._sptSel.hide();
	},


	OnLeave: function()
	{
		// ����-��������
		this.hide();
		this._sptSel.hide();
	},


	OnUpdate: function(T)
	{
		if(T <= 224)
		{
			//
			// ��START������������
			//
			if(Input.IsPressed(InputAction.START))
				T = 224;

			this.setY(448 - T * 2);
		}
		else if(T == 225)
		{
			// ��ʾ-̹��ͼ��
			this._sptSel.show();
		}
		else
		{
			//
			// ̹��ͼ�궯��
			//
			if(this._tickSel.On())
				this._sptSel.nextFrame();
		}

		//
		// ��START������Ϸ
		//
		if(Input.IsPressed(InputAction.START))
			return App.MyApp.Go(App.GameUI);

		return T;
	},


	DispScore: function()
	{
		//
		// "I- ��ǰ��  HI- ��߷�"
		//
		//var sCur = Misc.StrN(App.Game.Score? App.Game.Score : "00", 11);

		//this._lalScore.SetText("I-" + sCur + "  HI- " + App.Game.ScoreHi);
	}
});