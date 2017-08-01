/**
 * The scene class of the map screen.
 * @extends {Scene_MapInterface}
 */
// class Scene_Map extends Scene_MapInterface{
class Scene_Map extends Scene_MapInterface{
    /**
     * @override
     * @constructor
     */
    constructor(){
        super();

        this._encounterEffectDuration = 0;
        this._touchCount = 0;
        this._transfer = false;

        /**
         * @type {Window_Message}
         * @protected
         */
        this._messageWindow = null;
    }

    /**
     * @override
     */
    create() {
        super.create();
        this._transfer = $gamePlayer.isTransferring();
        let mapId = this._transfer ? $gamePlayer.newMapId() : $gameMap.mapId();
        DataManager.loadMapData(mapId);
    }

    // isReady() {
    //     return super.isReady();
    // }

    /**
     * @override
     */
    start() {
        super.start();
        if (this._transfer) {
            this._fadeInForTransfer();
            this._mapNameWindow.open();
            $gameMap.autoplay();
        } else if (this._needsFadeIn()) {
            this.startFadeIn(this.fadeSpeed(), false);
        }
        this.menuCalling = false;
    }

    /**
     * @override
     */
    update() {
        this._updateDestination();
        this._updateMainMultiply();
        if (this._isSceneChangeOk()) {
            this._updateScene();
        } //else if (SceneManager.isNextScene(Scene_Battle)) {
            //this._updateEncounterEffect();
        //}

        super.update();
    }

    stop() {
        super.stop();
        $gamePlayer.straighten();
        this._mapNameWindow.close();
        if (this._needsSlowFadeOut()) {
            this.startFadeOut(this.slowFadeSpeed(), false);
        } else if (SceneManager.isNextScene(Scene_Map)) {
            this._fadeOutForTransfer();
        }
        // else if (SceneManager.isNextScene(Scene_Battle)) {
        //     this._launchBattle();
        // }
    }

    /**
     * @override
     * @return {boolean}
     */
    isBusy() {
        return ((this._messageWindow && this._messageWindow.isClosing()) ||
            this._encounterEffectDuration > 0 ||
            super.isBusy());
    }

    /**
     * @override
     */
    terminate() {
        super.terminate();
        //if (!SceneManager.isNextScene(Scene_Battle)) {
            this._spriteset.update();
            this._mapNameWindow.hide();
            SceneManager.snapForBackground();
        //}
        $gameScreen.clearZoom();
        // Ivan: investigate why is it working, what keeps Scene_Map from freeing stuff
        this.removeChild(this._fadeSprite);
        this.removeChild(this._mapNameWindow);
        this.removeChild(this._windowLayer);
        this.removeChild(this._spriteset);
    }

    /**
     * @protected
     * @override
     */
    _onMapLoaded(){
        if (this._transfer) {
            $gamePlayer.performTransfer();
        }
        super._onMapLoaded();
    }

    /**
     * @private
     */
    _updateMainMultiply() {
        this._updateMain();
        if (this._isFastForward()) {
            this._updateMain();
        }
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

    _isFastForward() {
        return ($gameMap.isEventRunning() && !SceneManager.isSceneChanging() &&
            (Input.isLongPressed('ok') || TouchInput.isLongPressed()));
    }

    /**
     * @return {boolean}
     * @private
     */
    _needsFadeIn(){
        return (SceneManager.isPreviousScene(Scene_Battle) ||
            SceneManager.isPreviousScene(Scene_Load));
    }

    /**
     * @return {boolean}
     * @private
     */
    _needsSlowFadeOut(){
        return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
    }



    /**
     * @private
     */
    _updateDestination(){
        if (this._isMapTouchOk()) {
            this._processMapTouch();
        } else {
            $gameTemp.clearDestination();
            this._touchCount = 0;
        }
    }

    /**
     * @return {boolean}
     * @private
     */
    _isMapTouchOk() {
        return this.isActive() && $gamePlayer.canMove();
    }

    /**
     * @private
     */
    _processMapTouch() {
        if (TouchInput.isTriggered() || this._touchCount > 0) {
            if (TouchInput.isPressed()) {
                if (this._touchCount === 0 || this._touchCount >= 15) {
                    let x = $gameMap.canvasToMapX(TouchInput.x);
                    let y = $gameMap.canvasToMapY(TouchInput.y);
                    $gameTemp.setDestination(x, y);
                }
                this._touchCount++;
            } else {
                this._touchCount = 0;
            }
        }
    }

    /**
     * @return {boolean}
     * @private
     */
    _isSceneChangeOk(){
        return this.isActive() && !$gameMessage.isBusy();
    }

    _updateScene(){
        this.checkGameover();
        if (!SceneManager.isSceneChanging()) {
            this._updateTransferPlayer();
        }
        if (!SceneManager.isSceneChanging()) {
            this._updateEncounter();
        }
        if (!SceneManager.isSceneChanging()) {
            this._updateCallMenu();
        }
        if (!SceneManager.isSceneChanging()) {
            this._updateCallDebug();
        }
    }

    /**
     * @protected
     * @override
     */
    _createDisplayObjects(){
        super._createDisplayObjects();

        this._createMapNameWindow();
        this.createWindowLayer();
        this._createAllWindows();
    }

    /**
     * @private
     */
    _createMapNameWindow() {
        this._mapNameWindow = new Window_MapName();
        this.addChild(this._mapNameWindow);
    }

    /**
     * @private
     */
    _createAllWindows() {
        this._createMessageWindow();
        this._createScrollTextWindow();
    }

    /**
     * @private
     */
    _createMessageWindow() {
        this._messageWindow = new Window_Message();
        this.addWindow(this._messageWindow);
        this._messageWindow.subWindows().forEach(function(window) {
            this.addWindow(window);
        }, this);
    }

    /**
     * @private
     */
    _createScrollTextWindow() {
        this._scrollTextWindow = new Window_ScrollText();
        this.addWindow(this._scrollTextWindow);
    }

    _updateTransferPlayer(){
        if ($gamePlayer.isTransferring()) {
            SceneManager.goto(Scene_Map);
        }
    }

    _updateEncounter(){
        if ($gamePlayer.executeEncounter()) {
            SceneManager.push(Scene_Battle);
        }
    }

    _updateCallMenu(){
        if (this._isMenuEnabled()) {
            if (this._isMenuCalled()) {
                this.menuCalling = true;
            }
            if (this.menuCalling && !$gamePlayer.isMoving()) {
                this._callMenu();
            }
        } else {
            this.menuCalling = false;
        }
    }


    _isMenuEnabled() {
        return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning();
    }

    _isMenuCalled() {
        return Input.isTriggered('menu') || TouchInput.isCancelled();
    }

    _callMenu() {
        SoundManager.playOk();
        SceneManager.push(Scene_Menu);
        Window_MenuCommand.initCommandPosition();
        $gameTemp.clearDestination();
        this._mapNameWindow.hide();
        this._waitCount = 2;
    }

    _updateCallDebug(){
        if (this._isDebugCalled()) {
            SceneManager.push(Scene_Debug);
        }
    }

    _isDebugCalled() {
        return Input.isTriggered('debug') && $gameTemp.isPlaytest();
    }

    _fadeInForTransfer(){
        let fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0: case 1:
            this.startFadeIn(this.fadeSpeed(), fadeType === 1);
            break;
        }
    }

    _fadeOutForTransfer(){
        let fadeType = $gamePlayer.fadeType();
        switch (fadeType) {
            case 0: case 1:
            this.startFadeOut(this.fadeSpeed(), fadeType === 1);
            break;
        }
    }

    _launchBattle(){
        BattleManager.saveBgmAndBgs();
        this._stopAudioOnBattleStart();
        SoundManager.playBattleStart();
        this._startEncounterEffect();
        this._mapNameWindow.hide();
    }


    _stopAudioOnBattleStart() {
        if (!AudioManager.isCurrentBgm($gameSystem.battleBgm())) {
            AudioManager.stopBgm();
        }
        AudioManager.stopBgs();
        AudioManager.stopMe();
        AudioManager.stopSe();
    }

    _startEncounterEffect() {
        this._spriteset.hideCharacters();
        this._encounterEffectDuration = this._encounterEffectSpeed();
    }

    _updateEncounterEffect(){
        if (this._encounterEffectDuration > 0) {
            this._encounterEffectDuration--;
            let speed = this._encounterEffectSpeed();
            let n = speed - this._encounterEffectDuration;
            let p = n / speed;
            let q = ((p - 1) * 20 * p + 5) * p + 1;
            let zoomX = $gamePlayer.screenX();
            let zoomY = $gamePlayer.screenY() - 24;
            if (n === 2) {
                $gameScreen.setZoom(zoomX, zoomY, 1);
                this._snapForBattleBackground();
                this._startFlashForEncounter(speed / 2);
            }
            $gameScreen.setZoom(zoomX, zoomY, q);
            if (n === Math.floor(speed / 6)) {
                this._startFlashForEncounter(speed / 2);
            }
            if (n === Math.floor(speed / 2)) {
                BattleManager.playBattleBgm();
                this.startFadeOut(this.fadeSpeed());
            }
        }
    }

    _snapForBattleBackground(){
        this._windowLayer.visible = false;
        SceneManager.snapForBackground();
        this._windowLayer.visible = true;
    }

    _startFlashForEncounter(){
        const color = [255, 255, 255, 255];
        $gameScreen.startFlash(color, duration);
    }

    _encounterEffectSpeed(){
        return 60;
    }


}