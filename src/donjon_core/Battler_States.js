/**
 * @abstract
 */
class BattlerState {

    static TYPES = {
        NULL: 0,
        STANDING: 1,
        MOVING: 2,
        JUMPING: 3,
        ATTACKING: 4,
        BLOCKING: 5,
        HITTING: 6,
        DYING: 7,
        DEAD: 8
    };

    constructor() {
        /**
         * @type {number}
         * @protected
         */
        this._type = BattlerState.TYPES.NULL;
    }

    getType() {
        return this._type;
    }

    /**
     * @abstract
     */
    update() {
    }

    /**
     * @abstract
     */
    enterState() {
    }

    /**
     * @abstract
     */
    exitState() {
    }

}


class BattlerState_Standing extends BattlerState {

    constructor() {
        super();
        this._type = BattlerState.TYPES.STANDING;

    }

    enterState() {
        //reset pattern to origin, etc.
    }

    exitState() {

    }

    update() {

    }
}