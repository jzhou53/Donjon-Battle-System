/**
 * A manager class that store dynamic entities in the game map, and handle updates etc...
 * for example: characters are stored in a quadtree,
 *
 */

class Manager_DynamicEntity {

    /**
     * Constructor
     */
    constructor() {

        /**
         * the main data structure storing characters(collision) on map.
         * @type {Quadtree} quadtree data structure
         * @private
         */
        this._quadtree = new Quadtree(
            //new Rectangle(0, 0, $gameMap.width(), $gameMap.height()),
            new Rectangle(0, 0, Graphics.width, Graphics.height),
            10, //max_objects
            4   //max_level
        );
        console.debug("quadtree created " + Graphics.width + " * " + Graphics.height);

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

        this._debugBoard = new Sprite();

    }

    /**
     * Initialize when entering a new map.
     * @param mapId{int} the ID to the game Map stored in the database
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
        let debugTimeA = performance.now();

        //update all dynamic entities
        for (let i = this._entities.length - 1; i >= 0; i--) {
            let entity = this._entities[i];
            entity.update();
        }

        //update Quadtree
        this._updateQuadtree();

        //handle character entity collisions

        for (let i = this._entities.length - 1; i >= 0; i--) {
            let first = this._entities[i],
                targets = this._quadtree.retrieve(first);
            for (let j = targets.length - 1; j >= 0; j--) {
                let second = this._entities[j];
                this._handleCollision(first,second);
            }

        }

        /* lef of might be too slow */

        // for (let first of this._entities) {
        //     // get all possible targets that might collide with first entity
        //     let targets = this._quadtree.retrieve(first);
        //     for (let second of targets) {
        //         this._handleCollision(first, second);
        //     }
        // }

        let debugTimeB = performance.now();
        console.debug("logic tick: "+ (debugTimeB-debugTimeA)+" ms.");
    }

    /**
     * clear the tree structure and insert all entities into the tree again, handle collisions
     * the quadtree must be restructured every frame.
     * @private
     */
    _updateQuadtree() {
        //clear the tree
        this._quadtree.clear();

        //insert all entities into the tree again
        for (let i = this._entities.length - 1; i >= 0; i--) {
            let entity = this._entities[i];
            this._quadtree.insert(entity);
        }

        // for (let entity of this._entities) {
        //     this._quadtree.insert(entity);
        // }

    }

    /**
     * retrieve through the quadtree, return all possible targets that might collide with pRect.
     * example: .findPossibleTarget(new Rectangle(0,0,24,24));
     * @param pRect{QuadItem} any Object with QuadItem interface. typically just pass a Rect class
     * @return {Array} array with all detected objects
     */
    findPossibleTarget(pRect) {
        return this._quadtree.retrieve(pRect);
    }


    /**
     * check if entity first will collide with entity second
     * if collides, then trigger events.
     * @param first{QuadItem || GameEntity }
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
        const dist = Transform.distanceTo(
            first.getTransform(),
            second.getTransform()
        );

        if (dist < first.radius + second.radius)
        /* collision happened here */
        {
            // create collision event?
            first.onCollision(second);
            second.onCollision(first);
        }

    }

    /**
     * DEBUG USE
     */
    debugCreateEntity() {
        const entity = new TWBS_Character();
        let x = Math.randomInt(Graphics.width - 48),
            y = Math.randomInt(Graphics.height - 48);
        entity.setPosition(new Victor(x, y));
        this.addEntity(entity);

    }

    debugDisplayQuadtree(x, y) {



        if (!this._debugBoard.bitmap) {
            this._debugBoard.bitmap = new Bitmap(Graphics.width, Graphics.height);
        }

        this._debugBoard.bitmap.clear();

        // let pRect = new Rectangle(x,y,48*8,48*8);
        // let targets = s._quadtree.retrieve(pRect);

        // let map = new Map();
        // for(let entity of targets){
        //     map.set(entity,true);
        // }

        let color;
        this._entities.forEach(entity => {
                //if (!map.has(entity)){
                color = '#00FFFF';
                //}else{
                //color = '#ff2b32';
                //}
                let radius = entity.radius;
                let x = entity.x + radius;
                let y = entity.y + radius;
                //console.log(entity.getTransform().toString()+" r: "+radius);
                this._debugBoard.bitmap.drawCircle(x,y,radius,color);
            }
        );

        SceneManager._scene.addChild(this._debugBoard);

    }

    /**
     *
     * @param entity{GameEntity}
     */
    addEntity(entity) {

        this._countActiveEntities++;
        this._entities.push(entity);
        this._quadtree.insert(entity);
        console.debug("entity added " + this._entities.length);

    }


}