/**
 * a static class replacing RMMV SceneManager
 * @static {Manager_GameScene}
 */
class Manager_GameScene{

    static _scene             = null;
    static _nextScene         = null;
    static _stack             = [];
    static _stopped           = false;
    static _sceneStarted      = false;
    static _exiting           = false;
    static _previousClass     = null;
    static _backgroundBitmap  = null;
    static _screenWidth       = 816;
    static _screenHeight      = 624;
    static _boxWidth          = 816;
    static _boxHeight         = 624;
    static _deltaTime = 1.0 / 60.0;
    static _currentTime = Manager_GameScene._getTimeInMs();
    static _accumulator = 0.0;


    constructor(){
        throw new Error('This is a static class');
    }

    /**
     * Gets the current time in ms.
     * @return {number|*}
     * @private
     */
    static _getTimeInMs(){
        return performance.now();
    }

    /**
     *
     * @param sceneClass {Scene_Base}
     */
    static run(sceneClass){
        try {
            this.initialize();
            this.goto(sceneClass);
            this.requestUpdate();
        } catch (e) {
            this.catchException(e);
        }
    }


    static debug(){
        console.log(SceneManager._currentTime);
        console.log(this._currentTime);
    }


    static initialize() {
        this.initGraphics();
        this.checkFileAccess();
        this.initAudio();
        this.initInput();
        this.initNwjs();
        this.checkPluginErrors();
        this.setupErrorHandlers();
    }

    /**
     *
     * @param sceneClass {Scene_Base}
     */
    static goto(sceneClass) {
        if (sceneClass) {
            this._nextScene = new sceneClass();
        }
        if (this._scene) {
            this._scene.stop();
        }
    }

    static requestUpdate() {
        if (!this._stopped) {
            requestAnimationFrame(this.update.bind(this));
        }
    }

    /**
     *
     */
    static update(){
        try {
            this.tickStart();
            if (Utils.isMobileSafari()) {
                this.updateInputData();
            }
            this.updateMain();
            this.tickEnd();
        } catch (e) {
            this.catchException(e);
        }
    }

    /**
     *
     * @param e{Error}
     */
    static catchException(e) {

    }

    static initGraphics() {
        let type = this.preferableRendererType();
        Graphics.initialize(this._screenWidth, this._screenHeight, type);
        Graphics.boxWidth = this._boxWidth;
        Graphics.boxHeight = this._boxHeight;
        Graphics.setLoadingImage('img/system/Loading.png');
        if (Utils.isOptionValid('showfps')) {
            Graphics.showFps();
        }
        if (type === 'webgl') {
            this.checkWebGL();
        }
    }

    static preferableRendererType() {
        if (Utils.isOptionValid('canvas')) {
            return 'canvas';
        } else if (Utils.isOptionValid('webgl')) {
            return 'webgl';
        } else if (this.shouldUseCanvasRenderer()) {
            return 'canvas';
        } else {
            return 'auto';
        }
    }


    static shouldUseCanvasRenderer() {
        return Utils.isMobileDevice();
    }

    static checkWebGL() {
        if (!Graphics.hasWebGL()) {
            throw new Error('Your browser does not support WebGL.');
        }
    }


    static checkFileAccess() {
        if (!Utils.canReadGameFiles()) {
            throw new Error('Your browser does not allow to read local files.');
        }
    }

    static initAudio(){
        let noAudio = Utils.isOptionValid('noaudio');
        if (!WebAudio.initialize(noAudio) && !noAudio) {
            throw new Error('Your browser does not support Web Audio API.');
        }
    }

    static initInput(){
        Input.initialize();
        TouchInput.initialize();
    }

    static initNwjs(){
        if (Utils.isNwjs()) {
            let gui = require('nw.gui');
            //let gui = import('nw.gui');
            let win = gui.Window.get();
            if (process.platform === 'darwin' && !win.menu) {
                let menubar = new gui.Menu({ type: 'menubar' });
                let option = { hideEdit: true, hideWindow: true };
                menubar.createMacBuiltin('Game', option);
                win.menu = menubar;
            }
        }
    }

}

// SceneManager._scene             = null;
// SceneManager._nextScene         = null;
// SceneManager._stack             = [];
// SceneManager._stopped           = false;
// SceneManager._sceneStarted      = false;
// SceneManager._exiting           = false;
// SceneManager._previousClass     = null;
// SceneManager._backgroundBitmap  = null;
// SceneManager._screenWidth       = 816;
// SceneManager._screenHeight      = 624;
// SceneManager._boxWidth          = 816;
// SceneManager._boxHeight         = 624;
// SceneManager._deltaTime = 1.0 / 60.0;
// SceneManager._currentTime = SceneManager._getTimeInMs();
// SceneManager._accumulator = 0.0;