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
            new Rectangle(0, 0, 40, 40),
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


    }

    /**
     * Initialize when entering a new map.
     * @param mapId{int} the ID to the game Map stored in the database
     */
    setup(mapId){
        if (!$dataMap) {
            throw new Error('The map data is not available');
        }
        //load data from $dataMap (get map info, entities, graphics)

        //setup entities (both static and dynamic)

        //setup scroll and parallax (all the additional graphic layers)


    }


    /**
     * game logic tick (should be 1/60 second)
     */
    update() {
        //debugger;

        //update all dynamic entities
        for(let entity of this._entities.values()){
            this._quadtree.insert(entity);
        }

        //update Quadtree
        this._updateQuadtree();


    }

    /**
     * clear the tree structure and insert all entities into the tree again, handle collisions
     * @private
     */
    _updateQuadtree(){
        //clear the tree
        this._quadtree.clear();

        //insert all entities into the tree again
        for(let entity of this._entities.values()){
            this._quadtree.insert(entity);
        }

        //handle collisions
        for(let first of this._entities.values()){
            // get all possible targets that might collide with first entity
            let targets = this._quadtree.retrieve(first);
            for(let second of targets.values()){
                this._handleCollision(first,second);
            }
        }
    }

    /**
     * retrieve through the quadtree, return all possible targets that might collide with pRect.
     * example: .findPossibleTarget(new Rectangle(0,0,24,24));
     * @param pRect{QuadItem} any Object with QuadItem interface. typically just pass a Rect class
     * @return {Array} array with all detected objects
     */
    findPossibleTarget(pRect){
        return this._quadtree.retrieve(pRect);
    }


    /**
     * check if entity first will collide with entity second
     * if collides, then trigger events.
     * @param first{QuadItem}
     * @param second{QuadItem}
     * @private
     */
    _handleCollision(first, second){


    }

    /**
     * DEBUG USE
     */
    debugCreateEntity(){
        const entity = new TWBS_Character();
        this.addEntity(entity);
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