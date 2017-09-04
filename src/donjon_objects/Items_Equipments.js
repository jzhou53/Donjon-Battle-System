class Damage {
    /**
     * @param type {Number}
     * @param value {Number}
     */
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

/**
 * @abstract
 * TODO: add the following items
 *  1. horse
 *  2. one_handed_wpn
 *  3. two_handed_wpn
 *  4. polearm
 *  5. arrows
 *  6. bolts
 *  7. shield
 *  8. bow
 *  9. crossbow
 *  10. thrown
 *  11. goods
 *  12. head_armor
 *  13. body_armor
 *  14. pistol
 *  15. musket
 *  16. bullets
 *  17. animal
 *  18. book
 */

class Game_Items {

    static ITEM_TYPE = {
        HORSE: 0,
        ONE_HANDED_WPN: 1,
        TWO_HANDED_WPN: 2,
        POLEARM: 3,
        ARROW: 4,
        BOLT: 5,
        SHIELD: 6,
        BOW: 7,
        CROSSBOW: 8,
        THROWN: 9,
        GOODS: 10,
        HEAD_ARMOR: 11,
        BODY_ARMOR: 12,
        PISTOL: 13,
        MUSKET: 14,
        BULLET: 15,
        ANIMAL: 16,
        BOOK: 17,
    };

    /**
     * @param pDataItem {{id:number,name:String}}
     */
    constructor(pDataItem) {
        /**
         * @type {number}
         * @protected
         */
        this._id = pDataItem.id || 0;
        /**
         * @type {String|string}
         * @protected
         */
        this._name = pDataItem.name || '';

    }

    /**
     * @return {string}
     */
    toString() {
        return "[" + this._id + ": " + this._name + "]"
    }

}

class Game_Equipment extends Game_Items {

    constructor(pDataItem) {
        super(pDataItem);

    }


}


class Game_Weapon extends Game_Equipment {

    /**
     * @const
     * @type {{CUT: number, PIERCE: number, BLUNT: number}}
     */
    static DAMAGE_TYPE = {
        CUT: 0,
        PIERCE: 1,
        BLUNT: 2,
    };

    static MAP_TO_TYPES = new Map([
        ['cut', Game_Weapon.DAMAGE_TYPE.CUT],
        ['pierce', Game_Weapon.DAMAGE_TYPE.PIERCE],
        ['blunt', Game_Weapon.DAMAGE_TYPE.BLUNT],
    ]);

    /**
     * @constructor
     * @param pDataItem {{
     *  id:number,name:string,
     *  swingType:string,overheadType:string,thrustType:string,
     *  swingDamage:number,overheadDamage:number,thrustDamage:number,
     * }}
     */
    constructor(pDataItem) {
        super(pDataItem);

        this._weaponDamages = [
            new Damage(
                Game_Weapon.MAP_TO_TYPES.get(pDataItem.swingType), pDataItem.swingDamage
            ),
            new Damage(
                Game_Weapon.MAP_TO_TYPES.get(pDataItem.overheadType), pDataItem.overheadDamage
            ),
            new Damage(
                Game_Weapon.MAP_TO_TYPES.get(pDataItem.thrustType), pDataItem.thrustDamage
            )
        ];

        //other stuff like mass, length, speed ....

    }

    /**
     * @param atkType {number} range must be within 0 ... Game_Weapon.DAMAGE_TYPE.length-1
     * @return {Damage}
     */
    getDamage(atkType = 0) {
        return this._weaponDamages[atkType];
    }

    toString() {
        const str = ['c', 'p', 'b'];
        return "[" + this._id + ": " + this._name + " ("
            + this._weaponDamages[0].value + str[this._weaponDamages[0].type] + ", "
            + this._weaponDamages[1].value + str[this._weaponDamages[1].type] + ", "
            + this._weaponDamages[2].value + str[this._weaponDamages[2].type]
            + ")]"
    }

}


class Game_Armor extends Game_Equipment {

    /**
     * @param pDataItem{{
     *  id:number, name:string,
     *  maxHp:number, defence: number
     *  resistance:[number,number,number]
     * }}
     */
    constructor(pDataItem) {
        super(pDataItem);

        this._MaxHitPoint = pDataItem.maxHp;
        this._hitPoint = this._MaxHitPoint;

        /**
         * represent the quality of armor, the higher, the better in defencing.
         * @type {number} the value
         * @private
         */
        this._defence = pDataItem.defence;

        /**
         * the percentage factors against different damage types. typically cutting damage, piercing damage, and blunt damage.
         * @type {[number,number,number]} c, p , b
         * @private
         */
        this._resistanceFactors = [
            pDataItem.resistance[0],
            pDataItem.resistance[1],
            pDataItem.resistance[2]
        ];


        this._broken = false;
        this._overflowDamage = 0;
    }

    /**
     * @param pDamage{Damage}
     * @param speedFactor{float} 1.0 stands for normal
     */
    recieveDamage(pDamage, speedFactor) {
        const factorVal = this._resistanceFactors[pDamage.type]; // 0..100

        const damage = pDamage.value * speedFactor;

        this._hitPoint -= (damage * factorVal) / 100;

        if (this._hitPoint <= 0) {
            this._hitPoint = 0;
            this._broken = true;
            this._overflowDamage = damage;
        } else {
            this._overflowDamage = (damage * (100 - factorVal)) / 100;
        }


    }

    /**
     * check if Armor is broken and no longer available.
     * @return {boolean} the state of the armor's condition.
     */
    isBroken() {
        return this._broken;
    }

    /**
     * get unprotected damage, will be delivered to the character's hitpoint.
     * @return {number}
     */
    getOverflowDamage() {
        return this._overflowDamage;
    }

    /**
     *
     */
    toString() {
        return "[" + this._id + ": " + this._name + " ("
            + this._hitPoint + "/" + this._MaxHitPoint + ", "
            + this._defence + " def, "
            + this._resistanceFactors[0] + "%c, "
            + this._resistanceFactors[1] + "%p, "
            + this._resistanceFactors[2] + "%b"
            + ")]";
    }

}


