/**
 * @abstract
 * @extends {Scene_Base}
 */
class Scene_MapInterface extends Scene_Base {

    /**
     * @constructor
     * @override
     */
    constructor() {
        super();
        /**
         * @type {Spriteset_Map}
         * @protected
         */
        this._spriteset = null;
        /**
         * @type {boolean}
         * @protected
         */
        this._mapLoaded = false;
        /**
         * @type {number}
         * @protected
         */
        this._waitCount = 0;


    }

    /**
     * @override
     */
    create() {
        const mapId = $gameMap.mapId();
        DataManager.loadMapData(mapId);
    }

    /**
     * does not include load map data
     */
    start() {
        super.start();
        SceneManager.clearStack();
    }


    /**
     * load data map first then Image(super)
     * @protected
     * @return {boolean}
     */
    isReady() {
        if (!this._mapLoaded && DataManager.isMapLoaded()) {
            this._onMapLoaded();
            this._mapLoaded = true;
        }
        return this._mapLoaded && super.isReady();
    }

    /**
     * @protected
     */
    _onMapLoaded() {
        //console.log("_onMapLoaded");
        this._createDisplayObjects();
        //sent out loaded event
        EventsManager.queueEvent(new Evnt_SpritesetMapCreated(performance.now(), this._spriteset));
    }

    /**
     * @protected
     */
    _createDisplayObjects() {
        this._createSpriteset();
    }

    /**
     * @protected
     */
    _createSpriteset() {
        this._spriteset = new Spriteset_Map();
        this.addChild(this._spriteset);
    }

    /**
     * @override
     */
    update() {
        this._updateWaitCount();
        super.update();
    }

    /**
     * check if is waiting
     * @return {boolean}
     */
    isBusy() {
        return this._waitCount > 0 || super.isBusy();
    }

    /**
     * @return {boolean}
     * @protected
     */
    _updateWaitCount() {
        if (this._waitCount > 0) {
            this._waitCount--;
            return true;
        }
        return false;
    }

    /**
     * @override
     */
    terminate() {

        this.removeChild(this._spriteset);
    }


}