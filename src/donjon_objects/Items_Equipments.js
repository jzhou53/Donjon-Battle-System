class Damage {
    /**
     * @param rawDamage0 {number}
     * @param rawDamage1 {number}
     * @param rawDamage2 {number}
     */
    constructor(rawDamage0, rawDamage1, rawDamage2) {
        rawDamage0 = Math.floor(rawDamage0);
        rawDamage1 = Math.floor(rawDamage1);
        rawDamage2 = Math.floor(rawDamage2);
        this.baseDamage = rawDamage0;
        this.fleshDamage = rawDamage1;
        this.armorDamage = rawDamage2;
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

    static BASE_CRITICAL = 25;

    /**
     * @constructor
     * @param pDataItem {{
     *  id:number,name:string,
     *  damage:number, ignoreArmor:number, vsArmor:number
     *  critical:number,shieldDmg:number
     * }}
     */
    constructor(pDataItem) {
        super(pDataItem);

        this._baseDamage = pDataItem.damage;
        this._ignoreArmor = pDataItem.ignoreArmor;
        this._againstArmor = pDataItem.vsArmor;
        this._criticalModifier = pDataItem.critical;
        this._shieldDamage = pDataItem.shieldDmg;

        //other stuff like mass, length, speed ....

    }

    toString() {
        return "[" + this._id + ": " + this._name + " ("
            + this._baseDamage + ", " + this._ignoreArmor + "%,"
            + this._againstArmor + "%"
            + ")]"
    }

    /**
     * get base critical hit change + modifier
     * @return {number} 25 + modifier
     */
    getMaxCritical() {
        return Game_Weapon.BASE_CRITICAL + this._criticalModifier;
    }

    /**
     * @param speedFactor{number}
     * @param critical{boolean}
     * @return {Damage}
     */
    makeDamage(speedFactor, critical = false) {
        let damage = this._baseDamage * speedFactor;
        let rawFleshDamage = ( damage * this._ignoreArmor ) / 100,
            rawArmorDamage = ( damage * this._againstArmor ) / 100;
        if (critical) {
            rawFleshDamage *= 1.5;
            damage *= 1.5;
            //console.warn("Critical!!!!");
        }
        //console.debug("new damage: " + speedFactor + " * " + this._baseDamage + " = " + damage);

        return new Damage(damage, rawFleshDamage, rawArmorDamage);
    }

}


class Game_Armor extends Game_Equipment {

    /**
     * @param pDataItem{{
     *  id:number, name:string,
     *  durability:number
     * }}
     */
    constructor(pDataItem) {
        super(pDataItem);

        this._MaxDurability = pDataItem.durability;
        this._durability = this._MaxDurability;

        this._broken = false;
        this._fleshDamage = 0;
        this._armorDamage = 0;

    }

    /**
     * @param pDamage{Damage} raw damages
     */
    receiveDamage(pDamage) {

        if (this._broken) {
            this._fleshDamage = pDamage.baseDamage;
            this._armorDamage = 0;
        } else {
            this._armorDamage = pDamage.armorDamage;
            this.loseDurability(this._armorDamage);

            //10% of remaining armor
            const def = Math.floor((this._durability * 10) / 100);

            let finalDamage = pDamage.fleshDamage - def;
            if (finalDamage < 0) {
                finalDamage = 0;
            }

            this._fleshDamage = finalDamage;

        }
    }

    /**
     * check if Armor is broken and no longer available.
     * @return {boolean} the state of the armor's condition.
     */
    isBroken() {
        return this._broken;
    }

    getFlushDamage() {
        return this._fleshDamage;
    }

    getArmorDamage() {
        return this._armorDamage;
    }

    /**
     * @param damage{number}
     */
    loseDurability(damage) {
        this._durability -= damage;
        if (this._durability <= 0) {
            this._durability = 0;
            this._broken = true;
        }
    }

    /**
     *
     */
    toString() {
        return "[" + this._id + ": " + this._name + " ("
            + this._durability + "/" + this._MaxDurability
            + ")]";
    }

}


