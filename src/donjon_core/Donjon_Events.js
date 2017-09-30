/**
 * @global
 * @enum {number}
 */
const EventTypes = {
    NULL: 0x0000,
    SPRITESET_MAP_CREATED: 0x0001,
    REQUEST_SPRITE_REFRESH: 0x0002,
    CHARACTER_PERFORM_ATTACK: 0x0003,
    SPAWN_ENTITY: 0x0004
};

/**
 * @abstract
 */
class BasicEvent {

    /**
     * Constructor of a basic event without payloads.
     * @param timeStamp{number} passing the time Date.now() when this event is
     *     created.
     */
    constructor(timeStamp) {
        /** @protected @type {number} */
        this._timeStamp = timeStamp;
        /** @protected @type {EventTypes | number} */
        this._evtType = EventTypes.NULL;
    }

    /** @return {string} */
    getName() {
        return "" + this._evtType;
    }

    /** @return {EventTypes|number} */
    getEventType() {
        return this._evtType;
    }

    /** @return {number} */
    getTimeStamp() {
        return this._timeStamp;
    }

    /** @abstract */
    serialize() {}

    /** @abstract */
    deserialize() {}

}

/**
 * @extends {BasicEvent}
 */
class Evnt_SpritesetMapCreated extends BasicEvent {
    /**
     * @param timeStamp
     * @param map{Spriteset_Map}
     */
    constructor(timeStamp, map) {
        super(timeStamp);
        this._evtType = EventTypes.SPRITESET_MAP_CREATED;
        this._spritesetMap = map;
    }

    getSpritesetMap() {
        return this._spritesetMap;
    }
}

/**
 * @extends {BasicEvent}
 */
class Evnt_RequestSpriteRefresh extends BasicEvent {
    /**
     * @param timeStamp
     * @param map{Spriteset_Map}
     */
    constructor(timeStamp, map) {
        super(timeStamp);
        this._evtType = EventTypes.REQUEST_SPRITE_REFRESH;
        this._spritesetMap = map;
    }

    getSpritesetMap() {
        return this._spritesetMap;
    }
}

/**
 * @extends {BasicEvent}
 */
class Evnt_CharacterPerformAttack extends BasicEvent {
    /**
     * @param timeStamp{number}
     * @param pPerformer{Component_BattleCore}
     * @param pTarget{Component_BattleCore}
     * @param attackType{number}
     */
    constructor(timeStamp, pPerformer, pTarget, attackType) {
        super(timeStamp);
        this._evtType = EventTypes.CHARACTER_PERFORM_ATTACK;
        this._performer = pPerformer;
        this._target = pTarget;
        this._atkType = attackType;
    }

    getTarget() {
        return this._target;
    }

    getPerformer() {
        return this._performer;
    }

    getAttackType() {
        return this._atkType;
    }
}

/**
 * @extends {BasicEvent}
 */
class Evnt_SpawnEntity extends BasicEvent {

    /**
     * @para timeStamp{number}
     * @para entity{GameEntity}
     */
    constructor(timeStamp, entity) {
        super(timeStamp);
        this._evtType = EventTypes.SPAWN_ENTITY;
        this._entity = entity;

    }

    /**
     * @return {Game_Object}
     */
    getEntity() {
        return this._entity;
    }
}