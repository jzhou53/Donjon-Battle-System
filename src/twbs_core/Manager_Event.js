/**
 * A event manager class store events and queue them.
 *
 */
class EventManager {

    /**
     */
    constructor() {

        /**
         *
         * @type {Map} A Map of {Set}
         * @private
         */
        this._eventListeners = new Map();
        /**
         *
         * @type {[Set,Set]}
         * @private
         */
        this._queuedEvents = [new Set(),new Set()];
        this._currentQueue = 0;
        this._MAX_QUEUE = 2;
    }

    /**
     *
     * @param evtType
     * @param delegateFn {Function}
     * @return {boolean}
     */
    addListener(evtType, delegateFn) {

        // create empty array for type:evtType in the map
        if (!this._eventListeners.has(evtType)) {
            this._eventListeners.set(evtType, new Set());
        }
        //store the delegate of event type:evtType
        this._eventListeners.get(evtType).add(delegateFn);
        console.debug('Successfully added delegate for event type: '+evtType);
        return true;
    }

    /**
     *
     * @param evtType
     * @return {boolean}
     */
    removeListener(evtType){
        if (this._eventListeners.has(evtType)){
            console.debug("removed listener on type: "+evtType);
            return this._eventListeners.delete(evtType);
        }else {
            console.error('attempted to remove a listener on type:'+evtType+' that does not exist.');
        }
        return false;
    }

    /**
     *
     * @param pEvent {BasicEvent}
     * @return {boolean}
     */
    triggerEvent(pEvent){
        let processed = false;
        //check if has delegates for this event
        if(this._eventListeners.has(pEvent.getEventType())){
            //call, and pass pEvent to, each delegate
            this._eventListeners.get(pEvent.getEventType()).forEach(
                fn => {
                    fn.call(this,pEvent);
                    console.debug('Sending Event '+pEvent.getName()+' to delegate.');
                    processed = true;
                }
            )

        }else{
            console.debug('Skipping event '+pEvent.getEventType()+' since there are no delegates registered to receive it');
        }
        return processed;
    }


    /**
     *
     * @param pEvent{BasicEvent}
     * @return {boolean}
     */
    queueEvent(pEvent){

        // make sure the event is valid
        if (!pEvent){
            console.error("Invalid event in queueEvent");
            return false;
        }

        //queue
        if (this._eventListeners.has(pEvent.getEventType())){
            this._queuedEvents[this._currentQueue].add(pEvent);
            console.debug('Successfully queued event: '+pEvent.getName());
            return true;
        }else{
            console.debug('Skipping event '+pEvent.getEventType()+' since there are no delegates registered to receive it');
            return false;
        }

    }

    /**
     *
     * @param evtType
     * @param allOfType{boolean}
     * @return {boolean}
     */
    abortEvent(evtType,allOfType = false){
        let success = false;
        console.debug("attempt to abort event type: "+evtType);
        //if (this._eventListeners.has(evtType)){
            //TODO check if has bug
            for(let event of this._queuedEvents[this._currentQueue].values()){
                if (event.getEventType() === evtType){
                    this._queuedEvents[this._currentQueue].delete(event);
                    success = true;
                    console.debug("successfully aborted event type: "+evtType+" name: "+event.getName());
                    if(!allOfType)break;
                }
            }

       // }
        return success;
    }


    /**
     *
     */
    tick(){
        let time = performance.now();//Date.now();

        //swap queue
        let queueToProcess = this._currentQueue;
        this._currentQueue = (this._currentQueue + 1) % this._MAX_QUEUE;

        //process
        for(let event of this._queuedEvents[queueToProcess].values()){

            this.triggerEvent(event);

        }

        //clean up old processed queue
        this._queuedEvents[queueToProcess].clear();

        let passedTime = performance.now();
        console.debug("time took (queue "+queueToProcess+"): " + (passedTime-time));
    }


}