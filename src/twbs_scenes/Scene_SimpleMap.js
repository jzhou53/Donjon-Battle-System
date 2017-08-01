/**
 * @extends Scene_Base
 */
class Scene_SimpleMap extends Scene_MapInterface{

    /**
     * @override
     * @constructor
     */
    constructor(){
        super();

    }

    /**
     * @override
     */
    create(){
        const mapId = $gamePlayer.isTransferring() ? $gamePlayer.newMapId() : $gameMap.mapId();
        //console.log("map id: "+ mapId +" $gamePlayer.newMapId() = "+ $gamePlayer.newMapId() + ",$gameMap.mapId() = "+$gameMap.mapId());
        DataManager.loadMapData(mapId);
    }

    /**
     * @protected
     * @override
     */
    _onMapLoaded(){
        $gamePlayer.performTransfer();
        super._onMapLoaded();
    }

    start() {
        super.start();

    }


    update() {

        this._updateMain();

        super.update();
    }

    /**
     * @return {boolean}
     * @private
     */
    _isSceneChangeOk(){
        return this.isActive();
    }
    _updateScene(){
        // if (!SceneManager.isSceneChanging()) {
        //     this._updateTransferPlayer();
        // }
        // if (!SceneManager.isSceneChanging()) {
        //     this._updateEncounter();
        // }
        // if (!SceneManager.isSceneChanging()) {
        //     this._updateCallMenu();
        // }
        // if (!SceneManager.isSceneChanging()) {
        //     this._updateCallDebug();
        // }
    }
    /**
     * @private
     */
    _updateMain() {
        const active = this.isActive();
        $gameMap.update(active);
        $gamePlayer.update(active);
        $gameTimer.update(active);
        $gameScreen.update();
    }

    isBusy() {
        return super.isBusy();
    }

    _updateWaitCount() {
        return super._updateWaitCount();
    }



}