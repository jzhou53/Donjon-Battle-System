

class BasicEvent{

    /**
     *
     * @param timeStamp
     */
    constructor(timeStamp){

        this._time = timeStamp;
        this._evtType = 0;
    }

    /**
     *
     * @return {string}
     */
    getName(){
        return "";
    }

    getType(){
        return this._evtType;
    }

    serialize();

    deserialize();


}



