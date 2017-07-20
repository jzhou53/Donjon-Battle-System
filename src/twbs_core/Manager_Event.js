/**
 * A event manager class store events and queue them.
 *
 */
class EventManager {

    /**
     *
     */
    constructor() {

        /**
         *
         * @type {Map}
         * @private
         */
        this._eventListeners = new Map();
        this._queuedEvents = new Set();

    }

    /**
     *
     * @param evtType
     * @param delegateFn {Function}
     */
    addListener(evtType, delegateFn) {

        // create empty array for type:evtType in the map
        if (!this._eventListeners.has(evtType)) {
            this._eventListeners.set(evtType, []);
        }
        //store the delegate of event type:evtType
        this._eventListeners.get(evtType).push(delegateFn);

    }

    /**
     *
     * @param evtType
     */
    removeListener(evtType){

        if (this._eventListeners.has(evtType)){
            this._eventListeners.delete(evtType);
        }else {
            console.error("attempted to remove a listener on type:"+evtType+" that does not exist.");
        }

    }

    /**
     *
     * @param pEvent {BasicEvent}
     */
    triggerEvent(pEvent){

        if(this._eventListeners.has(pEvent.getType())){
            this._eventListeners.forEach((delegates)=>{
                delegates.forEach((fn)=>{
                    fn.call(this,pEvent);
                });
            });
        }

    }

    queueEvent(pEvent){

    }

    /**
     *
     * @param evtType
     * @param allOfType{bool}
     */
    abortEvent(evtType,allOfType){

    }


    tick(){

    }


}