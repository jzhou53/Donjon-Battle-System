/**
 * @global
 */
const EVENT_TYPES = {
    SpritesetMapCreated: 1,
    RequestSpriteRefresh: 2
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
        /**
         * @type {number}
         * @protected
         */
        this._timeStamp = timeStamp;
        /**
         * @type {number}
         * @protected
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

    getSpritesetMap() {
        return this._spritesetMap;
    }

}

class Evnt_RequestSpriteRefresh extends BasicEvent {
    /**
     * @param timeStamp
     * @param map{Spriteset_Map}
     */
    constructor(timeStamp, map) {
        super(timeStamp);
        this._evtType = EVENT_TYPES.RequestSpriteRefresh;
        this._spritesetMap = map;
    }

    getSpritesetMap() {
        return this._spritesetMap;
    }

}