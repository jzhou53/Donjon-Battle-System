
/*
 * Javascript Quadtree
 * @version 1.1.1
 * @licence MIT
 * @author Timo Hausmann
 * https://github.com/timohausmann/quadtree-js/
 * @modified Yanwen Xu
 * for RPG Maker MV
 */

class Quadtree {

    /**
     * Quadtree Constructor
     * @param {Rectangle} bounds with x, y, width, height
     * @param  {Integer} max_objects @optional
     * @param {Integer} max_level @optional
     * @param {Integer} level @optional
     */
    constructor(bounds, max_objects = 10, max_level = 4, level = 0) {

        this._maxObjects = max_objects;
        this._maxLevel = max_level;
        this._level = level;
        this._bounds = bounds;

        this._objects = [];
        this._nodes = [];

    }

    /**
     * Split the node into 4 sub-nodes
     * @private
     */
    _split() {

        const nextLevel = this._level + 1,
            subWidth = Math.round(this._bounds.width / 2),
            subHeight = Math.round(this._bounds.height / 2),
            x = Math.round(this._bounds.x),
            y = Math.round(this._bounds.y);

        //top right node
        this._nodes[0] = new Quadtree(new Rectangle
        (
            x + subWidth,
            y,
            subWidth,
            subHeight
        ), this._maxObjects, this._maxLevel, nextLevel);

        //top left node
        this._nodes[1] = new Quadtree(new Rectangle
        (
            x,
            y,
            subWidth,
            subHeight
        ), this._maxObjects, this._maxLevel, nextLevel);

        //bottom left node
        this._nodes[2] = new Quadtree(new Rectangle
        (
            x,
            y + subHeight,
            subWidth,
            subHeight
        ), this._maxObjects, this._maxLevel, nextLevel);

        //bottom right node
        this._nodes[3] = new Quadtree(new Rectangle
        (
            x + subWidth,
            y + subHeight,
            subWidth,
            subHeight
        ), this._maxObjects, this._maxLevel, nextLevel);

    }

    /**
     * Determine which node the object belongs to
     * @param {QuadItem} pRect        bounds of the area to be checked, with x, y, width, height
     * @return Integer        index of the sub-node (0-3), or -1 if pRect cannot completely fit within a sub-node and is part of the parent node
     */
    getIndex(pRect) {
        let index = -1;
        const px = this._bounds.x + (this._bounds.width / 2),
            py = this._bounds.y + (this._bounds.height / 2),
            //{bool} pRect can completely fit within the top quadrants
            topQuadrant = (pRect.y < py && pRect.y + pRect.height < py),
            //{bool} pRect can completely fit within the bottom quadrants
            bottomQuadrant = (pRect.y > py);

        //pRect can completely fit within the left quadrants
        if (pRect.x < px && pRect.x + pRect.width < px) {
            if (topQuadrant) {
                index = 1;
            } else if (bottomQuadrant) {
                index = 2;
            }

            //pRect can completely fit within the right quadrants
        } else if (pRect.x > px) {
            if (topQuadrant) {
                index = 0;
            } else if (bottomQuadrant) {
                index = 3;
            }
        }

        return index;

    }

    /**
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding sub-nodes.
     * @param {QuadItem} pRect        bounds of the object to be added, with x, y, width, height
     */
    insert(pRect) {
        let i = 0,
            index;

        if (typeof this._nodes[0] !== 'undefined') {
            index = this.getIndex(pRect);
            if (index !== -1) {
                this._nodes[index].insert(pRect);
                return;
            }
        }

        this._objects.push(pRect);

        if (this._objects.length > this._maxObjects && this._level < this._maxLevel) {

            if (typeof this._nodes[0] === 'undefined') {
                this._split();
            }

            while (i < this._objects.length) {
                index = this.getIndex(this._objects[i]);
                if (index !== -1) {
                    this._nodes[index].insert(this._objects.splice(i, 1)[0]);
                } else {
                    i = i + 1;
                }
            }

        }

    }

    /**
     * Return all objects that could collide with the given object
     * @param {QuadItem} pRect		bounds of the object to be checked, with x, y, width, height
     * @Return Array		array with all detected objects
     */
    retrieve(pRect){

        const index = this.getIndex(pRect);
        let returnObjects = this._objects;

        if( typeof this._nodes[0] !== 'undefined' ) {

            if( index !== -1 ) {
                returnObjects = returnObjects.concat( this._nodes[index].retrieve( pRect ) );

            } else {
                for( let i=0; i < this._nodes.length; i=i+1 ) {
                    returnObjects = returnObjects.concat( this._nodes[i].retrieve( pRect ) );
                }
            }
        }

        return returnObjects;

    }

    /**
     * Clear the quadtree
     */
    clear() {
        //console.log("clear Triggered");
        this._objects = [];
        for (let i = 0; i < this._nodes.length; ++i) {
            if (typeof this._nodes[i] !== 'undefined') {
                this._nodes[i].clear();
            }
        }
        this._nodes = [];
    }


}




/**
 *  In addition to what a Rectangle has, a QuadRect has a pointer pointing to the game entity owing this.
 *  should only used in Quadtree data structure
 *  @interface QuadItem
 */
class QuadItem{

    /**
     * x value of the top left point of the rect
     */
    get x(){
        throw new Error('x not implemented');
    }
    /**
     * y value of the top left point of the rect
     */
    get y(){
        throw new Error('y not implemented');
    }

    /**
     * width of the detector rectangle
     */
    get width(){
        throw new Error('y not implemented');
    }

    /**
     * heights of the detector rectangle
     */
    get height(){
        throw new Error('y not implemented');
    }


}
