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
        this._queuedEvents = new Set();

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
            this._queuedEvents.add(pEvent);
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
        //if (this._eventListeners.has(evtType)){
            //TODO check if has bug
            for(let event of this._queuedEvents){
                if (event.getEventType() === evtType){
                    this._queuedEvents.delete(event);
                    success = true;
                    if(!allOfType)break;
                }
            }

       // }
        return success;
    }


    tick(){

    }


}