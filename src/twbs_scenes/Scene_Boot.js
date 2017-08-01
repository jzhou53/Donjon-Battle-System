/**
 * The scene class for initializing the entire game.
 * @extends {Scene_Base}
 */
class Scene_Boot extends Scene_Base{

    /**
     * @override
     */
    constructor(){
        super();
        this._startDate = Date.now();
    }

    /**
     * @override
     */
    create(){
        super.create();
        DataManager.loadDatabase();
        ConfigManager.load();
        this.loadSystemWindowImage();
    }

    loadSystemWindowImage(){
        ImageManager.loadSystem('Window');
    }

    /**
     * @static
     */
    static loadSystemImages(){
        ImageManager.loadSystem('IconSet');
        ImageManager.loadSystem('Balloon');
        ImageManager.loadSystem('Shadow1');
        ImageManager.loadSystem('Shadow2');
        ImageManager.loadSystem('Damage');
        ImageManager.loadSystem('States');
        ImageManager.loadSystem('Weapons1');
        ImageManager.loadSystem('Weapons2');
        ImageManager.loadSystem('Weapons3');
        ImageManager.loadSystem('ButtonSet');
    }

    /**
     * @override
     */
    isReady(){
        if (super.isReady()) {
            return DataManager.isDatabaseLoaded() && this.isGameFontLoaded();
        } else {
            return false;
        }
    }

    isGameFontLoaded(){
        if (Graphics.isFontLoaded('GameFont')) {
            return true;
        } else {
            const elapsed = Date.now() - this._startDate;
            if (elapsed >= 20000) {
                throw new Error('Failed to load GameFont');
            }
        }
    }

    /**
     * will trigger when all data in database is loaded.
     * @override
     */
    start(){
        super.start();
        SoundManager.preloadImportantSounds();

        // no more battle test and event test.
        this.checkPlayerLocation();
        DataManager.setupNewGame();
        //SceneManager.goto(Scene_Map);
        SceneManager.goto(Scene_SimpleMap);
        Window_TitleCommand.initCommandPosition();

        this.updateDocumentTitle();
    }

    updateDocumentTitle(){
        document.title = $dataSystem.gameTitle;
    }

    checkPlayerLocation(){
        if ($dataSystem.startMapId === 0) {
            throw new Error('Player\'s starting position is not set');
        }
    }


}