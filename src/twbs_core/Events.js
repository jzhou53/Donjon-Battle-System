/**
 *
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
        this._evtType = timeStamp;
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
class Evnt_MapLoaded extends BasicEvent {

    /**
     * @param timeStamp
     * @param mapId {number}
     */
    constructor(timeStamp, mapId) {
        super(timeStamp);

    }


}



