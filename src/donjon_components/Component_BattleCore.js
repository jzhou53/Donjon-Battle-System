/**
 * @extends Component
 *
 */
class Component_BattleCore extends Component {

    static STATES = {
        WAIT: 0,
        ATTACK: 1,
        DEFEND: 2,
        HIT: 4,
        DYING: 5,
        DEAD: 6
    };

    /**
     * @constructor
     * @param owner
     * @param pDataBattler {{id,name,maxHp,headAmr,bodyAmr,meleeWpn,rangedWpn,shield}}
     */
    constructor(owner, pDataBattler) {
        super(owner);
        /**
         * States: Waiting, Attacking, Defending, Hitting, Dying, Dead
         * @type {Component_BattleCore.STATES}
         * @private
         */
        this._currentState = Component_BattleCore.STATES.WAIT;

        this.displayName = pDataBattler.name;

        //temp
        this.isDead = false;

        // this._attributes = [];
        // this._abilities = [];
        this._meleeWeapon = null;
        this._headArmor = null;
        this._bodyArmor = null;

        this._setupData(pDataBattler);


    }

    get hp() {
        return this._hitpoint;
    }

    get maxHp() {
        return this._maxHitpoint;
    }

    /**
     * @param pDataBattler {{id,name,maxHp,headAmr:Array,bodyAmr:Array,meleeWpn:Array,rangedWpn:Array,shield:Array}}
     * @private
     */
    _setupData(pDataBattler) {
        this._maxHitpoint = pDataBattler.maxHp;
        this._hitpoint = this._maxHitpoint;

        //pick a random equipment of equipments
        const weapons = pDataBattler.meleeWpn,
            headArmor = pDataBattler.headAmr,
            bodyArmor = pDataBattler.bodyAmr,
            dataWpn = $dataWeapons[weapons[Math.randomInt(weapons.length)]],
            dataHeadAmr = $dataArmors[headArmor[Math.randomInt(headArmor.length)]],
            dataBodyAmr = $dataArmors[bodyArmor[Math.randomInt(bodyArmor.length)]];

        if (dataWpn)
            this._meleeWeapon = new Game_Weapon(dataWpn);
        if (dataHeadAmr)
            this._headArmor = new Game_Armor(dataHeadAmr);
        if (dataBodyAmr)
            this._bodyArmor = new Game_Armor(dataBodyAmr);

    }

    /**
     * @override
     * @protected
     */
    _setupListeners() {

    }

    /**
     * @override
     */
    update() {

    }

    getMeleeWeapon() {
        return this._meleeWeapon;
    }

    getHeadArmor() {
        return this._headArmor;
    }

    getBodyArmor() {
        return this._bodyArmor;
    }

    /**
     * @param damage {number}
     */
    loseHitpoint(damage) {
        if (this.isDead) {
            return;
        }

        this._hitpoint -= damage;
        if (this._hitpoint <= 0) {
            this._hitpoint = 0;
            //todo send out death event, change state
            this.isDead = true;
        }
    }

    toString() {
        return this.displayName + '(' + this.hp + "/" + this.maxHp + ')';
    }

}