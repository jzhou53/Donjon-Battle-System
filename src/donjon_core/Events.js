/**
 * @global
 */
const EVENT_TYPES = {
    EntityCreated: 1,
    SpritesetMapCreated: 2
};

/**
 * @abstract
 */
class BasicEvent {

    /**
     * Constructor of a basic event without payloads.
     * @param timeStamp{number} passing the time Date.now() when this event is created.
     */
    constructor(timeStamp) {
        this._timeStamp = timeStamp;
        /**
         * @type {number}
         * @private
         */
        this._evtType = 0;
    }

    /**
     *
     * @return {string}
     */
    getName() {
        return "" + this._evtType;
    }

    getEventType() {
        return this._evtType;
    }

    getTimeStamp() {
        return this._timeStamp;
    }

    /**
     * @abstract
     */
    serialize() {
    }

    /**
     * @abstract
     */
    deserialize() {
    }

}

/**
 * @extends BasicEvent
 */
class Evnt_EntityCreated extends BasicEvent {

    /**
     * @param timeStamp
     * @param entity {GameEntity}
     */
    constructor(timeStamp, entity) {
        super(timeStamp);
        this._evtType = EVENT_TYPES.EntityCreated;
        this._entity = entity;
    }

    getEntity() {
        return this._entity;
    }


}

class Evnt_SpritesetMapCreated extends BasicEvent {
    /**
     * @param timeStamp
     * @param map{Spriteset_Map}
     */
    constructor(timeStamp, map) {
        super(timeStamp);
        this._evtType = EVENT_TYPES.SpritesetMapCreated;
        this._spritesetMap = map;
    }

    getSpriteseMap() {
        return this._spritesetMap;
    }

}

