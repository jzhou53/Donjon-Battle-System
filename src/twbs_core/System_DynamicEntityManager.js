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
         * the main data structure storing characters on map
         * @type {Quadtree}
         * @private
         */
        this._quadtree = new Quadtree(
            new Rectangle(0, 0, $gameMap.width(), $gameMap.height())
        );

        /**
         * the main array storing entities (including characters) on map
         * @type {Array}
         * @private
         */
        this._entities = [];


    }

    /**
     * game logic tick (should be 1/60 second)
     */
    update() {
        //clear the tree
        this._quadtree.clear();

        //update all entities and insert them into the tree again
        this._entities.forEach((entity) => {

            //entity.update();
            this._quadtree.insert(entity);

        });

        //handle collisions
        let targets = [];
        this._entities.forEach((first)=>{

            // get all possible targets that might collide with first entity
            targets = this._quadtree.retrieve(first);

            // handle collision
            targets.forEach((second)=>{
                this._handleCollision(first,second);
            });

        });

    }

    /**
     * check if entity first will collide with entity second
     * if collides, then trigger events.
     * @param first{Rectangle}
     * @param second{Rectangle}
     * @private
     */
    _handleCollision(first, second){


    }

}