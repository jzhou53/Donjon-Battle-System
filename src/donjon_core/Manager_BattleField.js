/**
 *
 */
class Manager_BattleField {

    /**
     * @constructor
     */
    constructor(dynamic_manager) {

        this._dynamicEntity = null;
        /**
         * @type {[Array,Array]}
         * @private
         */
        this._battlers = [[], []];

        this._setupBattleField(dynamic_manager);

        this._debugBattleEnded = false;

    }

    /**
     * @param first{Component_BattleCore} Attacker
     * @param second{Component_BattleCore} Defender
     */
    static handleTurn(first, second) {

        //temp
        const chanceHit = 50;
        let critical_flag = false;
        let d100 = Math.randomInt(100) + 1;

        if (d100 <= chanceHit) {
            //taking damage

            d100 = Math.randomInt(100) + 1;
            if (d100 <= first.getMeleeWeapon().getMaxCritical()) {
                critical_flag = true;
            }

            const factor = 1.0; //Math.randomInt(50) / 100 + 0.75;

            const raw_damage = first.getMeleeWeapon().getDamage(factor, critical_flag);

            const target_armor = critical_flag ?
                second.getHeadArmor() : second.getBodyArmor();

            const flesh_dmg = this._calculateFinalDamage(target_armor, raw_damage);

            second.loseHitpoint(flesh_dmg);

            //temp
            if (second.isDead) {
                this._debugBattleEnded = true;
            }


        } else {
            // defend

        }

    }

    /**
     * @param dynamic_manager {Manager_DynamicEntity}
     * @private
     */
    _setupBattleField(dynamic_manager) {
        this._dynamicEntity = dynamic_manager;
        this._dynamicEntity.debugCreateEntity();
        const entities = this._dynamicEntity.getAllEntities();
        entities.forEach(entity => {
            this._battlers[entity.getTeam()].push(entity);
        }, this);

    }

    update() {

        // if (this._debugBattleEnded) {
        //     //battle ended.....
        // } else {
        //     const tempA = this._battlers[0][0].getBattleComp(),
        //         tempB = this._battlers[1][0].getBattleComp();
        //
        //     this._handleTurn_Text(tempA, tempB);
        //     if (this._debugBattleEnded)
        //         return;
        //     this._handleTurn_Text(tempB, tempA);
        //
        // }


        //this._battlers[0][0].getRangeRect();

        this.findTargets(this._battlers[0][0]);
        //console.log(this._battlers[0][0].x+","+this._battlers[0][0].x);
        //console.log();
        //console.log(this._dynamicEntity.getEntitiesAt(this._battlers[0][0]));
    }

    /**
     * @param firstComp{Component_BattleCore}
     * @param secondComp{Component_BattleCore}
     * @private
     */
    _handleTurn_Text(firstComp, secondComp) {
        let string = '';

        string += (firstComp.toString() + "向 " + secondComp.toString() + "发动了攻击,");

        //temp
        const chanceHit = 50;
        let criticalFlag = false;
        let d100 = Math.randomInt(100) + 1;

        if (d100 <= chanceHit) {
            d100 = Math.randomInt(100) + 1;
            string += "击中了";
            //console.log(first.getMeleeWeapon());
            if (d100 <= firstComp.getMeleeWeapon().getMaxCritical()) {
                string += "要害头部(速度因子:";
                criticalFlag = true;
            } else {
                string += "身体(速度因子:";
            }

            let factor = 1.0;

            string += ( factor + ")，");

            const rawDamage = firstComp.getMeleeWeapon().getDamage(factor, criticalFlag);

            let fleshDmg, armorDmg;

            if (criticalFlag) {
                secondComp.getHeadArmor().receiveDamage(rawDamage);
                fleshDmg = secondComp.getHeadArmor().getFleshDamage();
                armorDmg = secondComp.getHeadArmor().getArmorDamage();

                const str = secondComp.getHeadArmor()._durability + "/" + secondComp.getHeadArmor()._MaxDurability;
                string += ("头盔(" + str + ")受到" + armorDmg + "点损伤，")
            } else {
                secondComp.getBodyArmor().receiveDamage(rawDamage);
                fleshDmg = secondComp.getBodyArmor().getFleshDamage();
                armorDmg = secondComp.getBodyArmor().getArmorDamage();

                const str = secondComp.getBodyArmor()._durability + "/" + secondComp.getBodyArmor()._MaxDurability;
                string += ("护甲(" + str + ")受到" + armorDmg + "点损伤，")
            }

            string += ("肉体受到" + fleshDmg + "点伤害。");

            secondComp.loseHitpoint(fleshDmg);

            //temp
            if (secondComp.isDead) {
                string += ("\n\n" + firstComp.toString() + "击杀了" + secondComp.toString() + "!!!!");
                this._debugBattleEnded = true;
            }


        } else {
            string += "但是被" + secondComp.displayName + "格挡或闪避了";
        }

        console.log(string);

    }

    /**
     * @param pArmor {Game_Armor}
     * @param rawDamage {Damage}
     * @return {number}
     * @private
     */
    _calculateFinalDamage(pArmor, rawDamage) {
        pArmor.receiveDamage(rawDamage);
        return pArmor.getFleshDamage();
    }

    /**
     * @param pBattler {Game_Character}
     * @return {Array}
     */
    findTargets(pBattler) {
        const arr = this._dynamicEntity.getEntitiesAt(pBattler.getRangeRect());
        console.log(arr);
        return arr.splice(arr.indexOf(pBattler), 1);
    }

}