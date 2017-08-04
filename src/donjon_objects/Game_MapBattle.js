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

        //set up dynamic entity manager
        this._setupDynamicManager();

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

        this._dynamicEntities.update();

    }

    /**
     * @return {Array.<RenderComponent>}
     */
    getEntityRenders() {
        const arr = [];
        const entities = this._dynamicEntities.getEntities();
        entities.forEach(entity => arr.push(entity.getComponent("Render")));
        return arr;
    }

}