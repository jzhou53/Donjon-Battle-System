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
         * @type {Array}
         * @private
         */
        this._battlers = [];

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
        //-----------
        //this._dynamicEntity.debugCreateEntity();
        //-----------
        const entities = this._dynamicEntity.getAllEntities();
        entities.forEach(entity => {
            this._battlers.push(entity);
        }, this);

    }

    update() {

        for (let i = 0; i < this._battlers.length; i++) {
            let first = this._battlers[i];
            //find nearest and move
            if (!first.getTransform().isMoving() && first.getState() !== BattlerState.TYPES.ATTACKING) {
                let leastTarget = this.findNearestTarget(first);
                this.moveBattlerToward(first, leastTarget);
            }
        }
        this._handleBattlerEncounter()

    }

    _handleBattlerEncounter() {
        for (let i = 0; i < this._battlers.length; i++) {
            let first = this._battlers[i],
                targets = this._dynamicEntity.getEntitiesAt(first.getRangeRect());
            targets = this.getOpponents(first, targets);
            for (let j = 0; j < targets.length; j++) {
                this._handleEncounter(first, targets[j])
            }
        }
    }

    /**
     * @param first {Game_Character} performer
     * @param second {Game_Character}
     * @private
     */
    _handleEncounter(first, second) {
        if (first.inMeleeRange(second) &&
            first.getState() !== BattlerState.TYPES.ATTACKING) {
            first.changeState(BattlerState.TYPES.ATTACKING);
            console.debug(first.id + " Engaged with " + second.id);
        }
    }

    /**
     * @param pBattler {Game_Character}
     * @return {Array}
     */
    findTargets(pBattler) {
        let arr = this._dynamicEntity.getEntitiesAt(pBattler.getRangeRect());
        return this.getOpponents(pBattler, arr);
    }

    /**
     * @param first {Game_Character}
     * @param others {Array.<Game_Character>}
     * @return {Array.<Game_Character>}
     */
    getOpponents(first, others) {
        return others.filter(battler =>
            battler.getTeam() !== first.getTeam()
        );
    }

    /**
     * @param first {Game_Character}
     * @return {Game_Character}
     */
    findNearestTarget(first) {
        let targets = this.findTargets(first);

        let least = Number.MAX_VALUE, leastTarget = targets[0];
        for (let i = 1; i < targets.length; i++) {
            let distance = Transform.squaredDistanceTo(
                first.getTransform(), targets[i].getTransform()
            );
            //distance = Math.round(distance);
            if (distance < least) {
                least = distance;
                leastTarget = targets[i];
            }
        }
        return leastTarget;
    }

    /**
     *
     * @param first {Game_Character}
     * @param second {Game_Character}
     */
    moveBattlerToward(first, second) {
        let d0 = first.getTransform().getPosition(),
            d1 = second.getTransform().getPosition();

        let direction = d1.clone();
        direction.subtract(d0).normalize();
        //temp
        this.moveStraight(first, direction);
        //first.getTransform().kinematicMove(direction);
    }

    /**
     * @param first{Game_Character}
     * @param direction{Victor}
     */
    moveStraight(first, direction) {
        let transform = first.getTransform(),
            sx = direction.x,
            sy = direction.y;
        if (Math.abs(sx) > Math.abs(sy)) {
            if (sx > 0) {
                transform.kinematicMove(new Victor(1, 0));
            } else {
                transform.kinematicMove(new Victor(-1, 0));
            }
        } else if (sy !== 0) {
            if (sy > 0) {
                transform.kinematicMove(new Victor(0, 1));
            } else {
                transform.kinematicMove(new Victor(0, -1));
            }
        }

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


}