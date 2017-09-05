/**
 *
 */
class Manager_BattleField {

    /**
     * @constructor
     */
    constructor() {

        this._setupBattleField();

        this._debugBattleEnded = false;

    }

    _setupBattleField() {
        const dataA = $dataBattlers[1];
        const dataB = $dataBattlers[2];
        this._actorA = new Component_BattleCore(null, dataA);
        this._actorB = new Component_BattleCore(null, dataB);

        console.log(this._actorA);
        console.log(this._actorB);
        console.warn("Characters Created!")
    }

    update() {

        while (!this._debugBattleEnded) {
            this._handleTurn_Text(this._actorA, this._actorB);
            if (!this._debugBattleEnded) {
                this._handleTurn_Text(this._actorB, this._actorA);
            }
        }

    }

    /**
     * @param first{Component_BattleCore}
     * @param second{Component_BattleCore}
     * @private
     */
    _handleTurn_Text(first, second) {
        let string = '';

        string += (first.toString() + "向 " + second.toString() + "发动了攻击,");

        //temp
        const chanceHit = 50;
        let criticalFlag = false;
        let d100 = Math.randomInt(100) + 1;

        if (d100 <= chanceHit) {
            d100 = Math.randomInt(100) + 1;
            string += "击中了";
            if (d100 <= first.getMeleeWeapon().getMaxCritical()) {
                string += "要害头部(速度因子:";
                criticalFlag = true;
            } else {
                string += "身体(速度因子:";
            }

            let factor = Math.randomInt(50) / 100 + 0.75;

            string += ( factor + ")，");

            const rawDamage = first.getMeleeWeapon().getDamage(factor, criticalFlag);

            let flushDmg, armorDmg;

            if (criticalFlag) {
                second.getHeadArmor().receiveDamage(rawDamage);
                flushDmg = second.getHeadArmor().getFlushDamage();
                armorDmg = second.getHeadArmor().getArmorDamage();

                const str = second.getHeadArmor()._durability + "/" + second.getHeadArmor()._MaxDurability;
                string += ("头盔(" + str + ")受到" + armorDmg + "点损伤，")
            } else {
                second.getBodyArmor().receiveDamage(rawDamage);
                flushDmg = second.getBodyArmor().getFlushDamage();
                armorDmg = second.getBodyArmor().getArmorDamage();

                const str = second.getBodyArmor()._durability + "/" + second.getBodyArmor()._MaxDurability;
                string += ("护甲(" + str + ")受到" + armorDmg + "点损伤，")
            }

            string += ("肉体受到" + flushDmg + "点伤害。");

            second.loseHitpoint(flushDmg);

            //temp
            if (second.isDead) {
                string += ("\n\n" + first.toString() + "击杀了" + second.toString() + "!!!!");
                this._debugBattleEnded = true;
            }


        } else {
            string += "但是被" + second.displayName + "格挡或闪避了";
        }

        console.log(string);

    }


    /**
     * @param first{Component_BattleCore} Attacker
     * @param second{Component_BattleCore} Defender
     * @private
     */
    _handleTurn(first, second) {

        //temp
        const chanceHit = 50;
        let criticalFlag = false;
        let d100 = Math.randomInt(100) + 1;

        if (d100 <= chanceHit) {
            //taking damage

            d100 = Math.randomInt(100) + 1;
            if (d100 <= first.getMeleeWeapon().getMaxCritical()) {
                criticalFlag = true;
            }

            const factor = Math.randomInt(50) / 100 + 0.75;

            const rawDamage = first.getMeleeWeapon().getDamage(factor, criticalFlag);

            const targetArmor = criticalFlag ? second.getHeadArmor() : second.getBodyArmor();

            const flushDmg = this._getFinalDamage(targetArmor, rawDamage);

            second.loseHitpoint(flushDmg);

            //temp
            if (second.isDead) {
                this._debugBattleEnded = true;
            }


        } else {
            // defend

        }

    }

    /**
     * @param pArmor {Game_Armor}
     * @param rawDamage {Damage}
     * @return {number}
     * @private
     */
    _getFinalDamage(pArmor, rawDamage) {
        pArmor.receiveDamage(rawDamage);
        return pArmor.getFlushDamage();
    }

}