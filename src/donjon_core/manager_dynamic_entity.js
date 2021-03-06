/**
 * A manager class that store dynamic entities in the game map, and handle
 * updates etc... for example: characters are stored in a quadtree,
 *
 */
class Manager_DynamicEntity {

    /**
     * @param width {number}
     * @param height {number}
     */
    constructor(width, height) {

        /**
         * the main data structure storing characters(collision) on map.
         * @type {Quadtree} quadtree data structure
         * @private
         */
        this._quadtree = new Quadtree(
            new Rectangle(0, 0, width, height),
            10, //max_objects
            4   //max_level
        );

        /**
         * the main array storing entities (including characters) on map
         * @type {Array} array of {Game_Entities}
         * @private
         */
        this._entities = [];

        /**
         * store the number of active entities
         * @type {number}
         * @private
         */
        this._countActiveEntities = 0;

        //this._debugBoard = new Sprite();

        this.nextId_ = 0;
    }

    static getNextEntityId() {
        return ++this.nextId_;
    }

    /**
     * Initialize when entering a new map.
     * @param mapId{Number} the ID to the game Map stored in the database
     */
    setup(mapId) {
        if (!$dataMap) {
            throw new Error('The map data is not available');
        }
        //load data from $dataMap (get map info, entities, graphics)

        //setup entities (both static and dynamic)

        //setup scroll and parallax (all the additional graphic layers)

    }

    /**
     * game logic tick (should be 1/60 second)
     * @public
     */
    update() {
        let delta_time = performance.now();

        this._updateAllEntities();
        this._updateQuadtree();
        //this._handleEntityCollisions();

        delta_time = performance.now() - delta_time;
        //console.debug("logic tick: " + delta_time + " ms.");
    }

    _handleEntityCollisions() {
        for (let i = 0; i < this._entities.length; i++) {
            const first = this._entities[i],
                targets = this._quadtree.retrieve(first);
            for (let j = 0; j < targets.length; j++) {
                this._handleCollision(first, targets[j])
            }
        }
    }

    /**
     * call update function of all entities in array _entities
     * @private
     */
    _updateAllEntities() {
        for (let i = this._entities.length - 1; i >= 0; i--) {
            this._entities[i].update();
        }
    }

    /**
     * clear the tree structure and insert all entities into the tree again,
     * handle collisions the quadtree must be restructured every frame.
     * @private
     */
    _updateQuadtree() {
        this._quadtree.clear();
        //insert all entities into the tree again
        for (let i = 0; i < this._entities.length; i++) {
            const entity = this._entities[i];
            this._quadtree.insert(entity);
        }
    }

    /**
     * retrieve through the quadtree, return all possible targets that might
     * collide with pRect. example: .findPossibleTarget(new
     * Rectangle(0,0,24,24));
     * @param pRect{QuadItem} any Object with QuadItem interface. typically
     *     just pass a Rect class
     * @return {Array} array with all detected objects
     */
    findPossibleTarget(pRect) {
        return this._quadtree.retrieve(pRect);
    }

    /**
     * check if entity first will collide with entity second
     * if collides, then trigger events.
     * @param first{QuadItem || GameEntity}
     * @param second{QuadItem || GameEntity}
     * @return {boolean} if handled
     * @private
     */
    _handleCollision(first, second) {
        // make sure both item does not point to same object
        if (first === second) {
            return false;
        }

        //simple circle collision detection
        const dist = Transform.squaredDistanceTo(
            first.getTransform(),
            second.getTransform()
        );

        if (dist <= Math.pow(first.radius + second.radius, 2))
        /* collision happened here */
        {
            // create collision event? <---- No
            first.onCollision(second);
            //second.onCollision(first);
        }

    }

    /**
     * DEBUG USE
     */
    debugCreateEntity() {
        let x = Math.randomInt(15);
        let y = Math.randomInt(15);
        let num = Math.randomInt(10) + 5;
        for (let i = 0; i < num; ++i)
            this.spawnEntity(1, x + i, y, 0);

        x = Math.randomInt(15);
        y = Math.randomInt(15);
        num = Math.randomInt(10) + 5;
        for (let i = 0; i < num; ++i)
            this.spawnEntity(2, x + i, y, 1);
    }

    /**
     * @param entity_id{number}
     * @param x{number}
     * @param y{number}
     * @param team_id{number}
     */
    spawnEntity(entity_id, x, y, team_id = 0) {
        let entity = this.createBattler(entity_id, x, y);
        this.addEntity(entity);
        entity.setTeam(team_id);
        EventsManager.queueEvent(new Evnt_SpawnEntity(performance.now(), entity));
    }

    /**
     * @param id {number}
     * @param x {number}
     * @param y {number}
     * @return {Game_Character}
     */
    createBattler(id, x, y) {
        const entity = new Game_Character(
            Manager_DynamicEntity.getNextEntityId(),
            $dataBattlers[id]
        );
        entity.setPosition(new Victor(x, y));
        return entity;
    }

    /**
     * Add entity to both list and quadtree
     * @param entity{GameEntity | QuadItem}
     */
    addEntity(entity) {
        this._countActiveEntities++;
        this._entities.push(entity);
        this._quadtree.insert(entity);
        console.debug("entity added " + this._entities.length);
    }

    /**
     * @return {Array}
     */
    getAllEntities() {
        return this._entities;
    }

    /**
     * @param pEntity {QuadItem | GameEntity}
     * @return {Array}
     */
    getEntitiesAt(pEntity) {
        return this._quadtree.retrieve(pEntity);
    }

}