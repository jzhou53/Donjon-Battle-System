/**
 * The scene class for initializing the entire game.
 * @extends {Scene_Base}
 */
class Scene_Boot extends Scene_Base {

    /**
     * @override
     */
    constructor() {
        super();
        this._startDate = Date.now();
    }

    /**
     * @override
     */
    create() {
        super.create();
        DataManager.loadDatabase();
        ConfigManager.load();
        this.loadSystemWindowImage();
    }

    loadSystemWindowImage() {
        ImageManager.reserveSystem('Window');
    }

    /**
     * @static
     */
    static loadSystemImages() {
        ImageManager.reserveSystem('IconSet');
        ImageManager.reserveSystem('Balloon');
        ImageManager.reserveSystem('Shadow1');
        ImageManager.reserveSystem('Shadow2');
        ImageManager.reserveSystem('Damage');
        ImageManager.reserveSystem('States');
        ImageManager.reserveSystem('Weapons1');
        ImageManager.reserveSystem('Weapons2');
        ImageManager.reserveSystem('Weapons3');
        ImageManager.reserveSystem('ButtonSet');
    }

    /**
     * @override
     */
    isReady() {
        if (super.isReady()) {
            return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
        } else {
            return false;
        }
    }

    isGameFontLoaded() {
        if (Graphics.isFontLoaded('GameFont')) {
            return true;
        } else if (!Graphics.canUseCssFontLoading()){
            let elapsed = Date.now() - this._startDate;
            if (elapsed >= 60000) {
                throw new Error('Failed to load GameFont');
            }
        }
    }

    /**
     * will trigger when all data in database is loaded.
     * @override
     */
    start() {
        super.start();
        SoundManager.preloadImportantSounds();

        if ($debugging) {
            this._donjonDebugStart();
        } else {
            this._normalStart();
        }
    }

    _normalStart() {
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        SceneManager.goto(Scene_SimpleMap);
        //Window_TitleCommand.initCommandPosition();
        this.updateDocumentTitle();
    }

    /**
     * Donjon Debugging
     * @private
     */
    _donjonDebugStart() {
        document.title = "DEBUGGING";

        boooooooom();

    }


    updateDocumentTitle() {
        document.title = $dataSystem.gameTitle;
    }

    checkPlayerLocation() {
        if ($dataSystem.startMapId === 0) {
            throw new Error('Player\'s starting position is not set');
        }
    }


}