/**
 *
 * @abstract
 */
class BasicEvent{

    /**
     * Constructor of a basic event without payloads.
     * @param timeStamp{number} passing the time Date.now() when this event is created.
     */
    constructor(timeStamp){

        this._timeStamp = timeStamp;
        this._evtType = timeStamp;
    }

    /**
     *
     * @return {string}
     */
    getName(){
        return ""+this._evtType;
    }

    getEventType(){
        return this._evtType;
    }

    getTimeStamp(){
        return this._timeStamp;
    }

    serialize(){}

    deserialize(){}

}

/**
 * @extends BasicEvent
 */
class Evnt_Collision extends BasicEvent{

    constructor(timeStamp, ){
        super(timeStamp);

    }

}



