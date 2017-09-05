/**
 * @extends Component
 *
 */
class Component_BattleCore extends Component {

    /**
     * @param owner
     * @param pDataBattler {{id,name,maxHp,headAmr,bodyAmr,meleeWpn,rangedWpn,shield}}
     */
    constructor(owner, pDataBattler) {
        super(owner);
        this._setupData(pDataBattler);
        this._currentState = null; //should be normal state

        //temp
        this.isDead = false;

        this.displayName = pDataBattler.name;


        // this._attributes = [];
        // this._abilities = [];

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

        this._meleeWeapon = null;
        this._headArmor = null;
        this._bodyArmor = null;

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
        super._setupListeners();

    }

    update() {
        super.update();
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
            //todo send out death event
            this.isDead = true;
        }
    }

    toString() {
        return this.displayName + '(' + this.hp + "/" + this.maxHp + ')';
    }

}