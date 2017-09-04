class Component_BattleCore extends Component {

    constructor(owner) {
        super(owner);

        this._maxHp = 100;
        this._currentHp = this._maxHp;

        this._currentState = null;

        this._equpments = [];
        this._weaponds = [];
        this._attributes = [];
        this._abilities = [];


    }

    /**
     * @override
     * @protected
     */
    _setupListeners() {
        super._setupListeners();
    }

    update() {
        super.update();
    }

}