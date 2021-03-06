/**
 * @extends Scene_Base
 */
class Scene_SimpleMap extends Scene_MapInterface {

    /**
     * @override
     * @constructor
     */
    constructor() {
        super();

    }

    /**
     * @override
     */
    create() {
        //const mapId = $gamePlayer.isTransferring() ? $gamePlayer.newMapId() : $gameMap.mapId();
        //console.log("map id: "+ mapId +" $gamePlayer.newMapId() = "+ $gamePlayer.newMapId() + ",$gameMap.mapId() = "+$gameMap.mapId());

        DataManager.loadMapData(1);
    }

    /**
     * @protected
     * @override
     */
    _onMapLoaded() {
        //$gamePlayer.performTransfer();
        $gameMap.setup(this._newMapId);
        super._onMapLoaded();
    }

    start() {
        super.start();

    }

    /**
     * called constantly
     */
    update() {

        this._updateMain();

        super.update();
    }

    /**
     * @return {boolean}
     * @private
     */
    _isSceneChangeOk() {
        return this.isActive();
    }

    _updateScene() {

    }

    /**
     * @private
     */
    _updateMain() {
        const active = this.isActive();
        $gameMap.update(active);
        //$gamePlayer.update(active);
        //$gameTimer.update(active);
        $gameScreen.update();
    }

    isBusy() {
        return super.isBusy();
    }

    _updateWaitCount() {
        return super._updateWaitCount();
    }


}