/**
 * @extends Game_Map
 */
class Game_BattleMap extends Game_Map{
    /**
     * @constructor
     */
    constructor(){
        super();
        /**
         * @type {Manager_DynamicEntity}
         * @private
         */
        this._dynamicEntities = null;
    }

    /**
     * @override
     * @param mapId
     */
    setup(mapId) {
        super.setup(mapId);
        //set up static manager
        console.log("Fucking asshole");
        //set up dynamic entity manager
        this._setupDynamicManager();

        this._dynamicEntities.debugCreateEntity();
        this._dynamicEntities.debugCreateEntity();
    }

    /**
     * @private
     */
    _setupDynamicManager() {
        this._dynamicEntities = new Manager_DynamicEntity(this.width(),this.height());
        this._dynamicEntities.setup(this.mapId());

    }

    /**
     * @param sceneActive
     */
    update(sceneActive) {
        super.update(sceneActive);

        if(!this.motherfuckers){
            this.motherfuckers = new Sprite();
            this.motherfuckers.bitmap = new Bitmap(200,200);
            this.motherfuckers.bitmap.fillRect(0,0,200,200,'#ffffff');
            const stage = SceneManager._scene;
            stage.addChild(this.motherfuckers);
        }
        this.motherfuckers.x = 100;
        this.motherfuckers.y = 100;

        this._dynamicEntities.update();
        this._dynamicEntities.debugDisplayQuadtree();

    }
}