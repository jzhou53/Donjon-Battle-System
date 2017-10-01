class EventsManager {

    constructor() {
        throw new Error('This is a static class');
    }

    /**
     * @param evtType {EventTypes}
     * @param delegateFn {Function}
     * @return {boolean}
     */
    static addListener(evtType, delegateFn) {
        if (!this._eventListeners.hasOwnProperty(evtType)) {
            Object.defineProperty(this._eventListeners, evtType, {
                enumerable: true,
                configurable: true,
                value: []
            });
        }
        this._eventListeners[evtType].push(delegateFn);
        console.debug('Successfully added delegate for event type: ' + evtType);
        return true;
    }

    /**
     * @param evtType {EventTypes}
     * @return {boolean}
     */
    static removeListener(evtType) {
        if (this._eventListeners.hasOwnProperty(evtType)) {
            console.debug("removed listener on type: " + evtType);
            delete this._eventListeners[evtType];
            return true;
        } else {
            console.error('attempted to remove a listener on type:'
                + evtType + ' that does not exist.');
        }
        return false;
    }

    /**
     * @param pEvent{BasicEvent}
     * @return {boolean}
     */
    static triggerEvent(pEvent) {
        let processed = false;
        //check if has delegates for this event
        if (this._eventListeners.hasOwnProperty(pEvent.getEventType())) {
            //call, and pass pEvent to, each delegate
            this._eventListeners[pEvent.getEventType()].forEach(
                fn => {
                    fn.call(this, pEvent);
                    console.debug('Sending Event ' + pEvent.getName()
                        + ' to delegate.');
                    processed = true;
                }
            );

        } else {
            console.debug('Skipping event ' + pEvent.getEventType()
                + ' since there are no delegates registered to receive it');
        }
        return processed;
    }

    /**
     * @param pEvent{BasicEvent}
     * @return {boolean}
     */
    static queueEvent(pEvent) {
        // make sure the event is valid
        if (!pEvent) {
            console.error("Invalid event in queueEvent");
            return false;
        }
        //queue the event
        if (this._eventListeners.hasOwnProperty(pEvent.getEventType())) {
            this._queuedEvents[this._currentQueue].push(pEvent);
            console.debug('Successfully queued event: ' + pEvent.getName());
            return true;
        } else {
            console.debug('Skipping event ' + pEvent.getEventType()
                + ' since there are no delegates registered to receive it');
            return false;
        }
    }

    /**
     * @param evtType
     * @param allOfType{boolean}
     * @return {boolean}
     */
    static abortEvent(evtType, allOfType = false) {
        let success = false;
        console.debug("attempt to abort event type: " + evtType);
        //if (this._eventListeners.has(evtType)){
        //TODO check if has bug

        for (let event of this._queuedEvents[this._currentQueue].values()) {
            if (event.getEventType() === evtType) {
                const arr = this._queuedEvents[this._currentQueue];
                arr[this._currentQueue].splice(arr.indexOf(event), 1);

                success = true;
                console.debug("successfully aborted event type: "
                    + evtType + " name: " + event.getName());
                if (!allOfType) break;
            }
        }

        // }
        return success;
    }

    static tick() {
        let time = performance.now();
        let eventHandled = 0;

        //swap queue
        let queueToProcess = this._currentQueue;
        this._currentQueue = (this._currentQueue + 1) % this._MAX_QUEUE;

        //process
        const queue = this._queuedEvents[queueToProcess];
        for (let i = 0; i < queue.length; i++) {
            const event = queue[i];
            this.triggerEvent(event);
            eventHandled++;
        }

        //clean up old processed queue
        this._queuedEvents[queueToProcess] = [];

        let passedTime = performance.now();
        if (eventHandled)
            console.debug("time took (queue " + queueToProcess
                + ") to handle " + eventHandled + " event(s): "
                + (passedTime - time));
    }
}

/**
 * @type {Object}
 * @private
 */
EventsManager._eventListeners = {};
/**
 * @type {[Array,Array]}
 * @private
 */
EventsManager._queuedEvents = [[], []];
/**
 * @type {number}
 * @private
 */
EventsManager._currentQueue = 0;
/**
 * @const
 * @type {number}
 * @private
 */
EventsManager._MAX_QUEUE = 2;