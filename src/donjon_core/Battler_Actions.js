class BattlerActions {
    constructor() {
        this._isDone = false;
    }

    execute() {
        this._isDone = true;
    }

    isDone() {
        return this._isDone;
    }
}

class Action_Move extends BattlerActions {
    /**
     * @param owner {Game_Character}
     * @param delta_pos {Victor}
     */
    constructor(owner, delta_pos) {
        super();
        this._transform = owner.getTransform();
        this._deltaPos = delta_pos;
    }

    execute() {
        let str = this._transform.getPosition().toString();

        this._transform.getPosition().add(this._deltaPos);
        super.execute();

        str += " to " + this._transform.getPosition().toString();
        console.debug('Action_Move::execute triggered: ' + str);
    }
}

class Action_Attack extends BattlerActions {
    /**
     * @param owner {Game_Character}
     * @param pTarget {Game_Character}
     */
    constructor(owner, pTarget) {
        super();
        this._attacker = owner;
        this._target = pTarget;
    }

    execute() {
        Manager_BattleField.handleTurn(
            this._attacker.getComponent('Battle'),
            this._target.getComponent('Battle')
        );
        super.execute();
    }
}