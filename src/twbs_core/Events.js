

class BasicEvent{

    /**
     *
     * @param timeStamp
     */
    constructor(timeStamp){

        this._time = timeStamp;
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


}



