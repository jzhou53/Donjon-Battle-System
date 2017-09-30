/**
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
     * @param  {number} max_objects @optional
     * @param {number} max_level @optional
     * @param {number} level @optional
     */
    constructor(bounds, max_objects = 10, max_level = 4, level = 0) {
        /** @private @type {number} */
        this.maxObjects_ = max_objects;

        /** @private @type {number} */
        this.maxLevel_ = max_level;

        /** @private @type {number} */
        this.level_ = level;

        /** @private @type {Rectangle} */
        this.bounds_ = bounds;

        /** @private @type {Array.<QuadItem>} */
        this.objects_ = [];

        /** @private @type {Array.<Quadtree>} */
        this.nodes_ = [];

    }

    /**
     * Split the node into 4 sub-nodes
     * @private
     */
    split_() {
        let nextLevel = this.level_ + 1;
        let subWidth = Math.round(this.bounds_.width / 2);
        let subHeight = Math.round(this.bounds_.height / 2);
        let x = Math.round(this.bounds_.x);
        let y = Math.round(this.bounds_.y);

        //top right node
        this.nodes_[0] = new Quadtree(new Rectangle(
            x + subWidth,
            y,
            subWidth,
            subHeight
        ), this.maxObjects_, this.maxLevel_, nextLevel);

        //top left node
        this.nodes_[1] = new Quadtree(new Rectangle(
            x,
            y,
            subWidth,
            subHeight
        ), this.maxObjects_, this.maxLevel_, nextLevel);

        //bottom left node
        this.nodes_[2] = new Quadtree(new Rectangle(
            x,
            y + subHeight,
            subWidth,
            subHeight
        ), this.maxObjects_, this.maxLevel_, nextLevel);

        //bottom right node
        this.nodes_[3] = new Quadtree(new Rectangle(
            x + subWidth,
            y + subHeight,
            subWidth,
            subHeight
        ), this.maxObjects_, this.maxLevel_, nextLevel);

    }

    /**
     * Determine which node the object belongs to
     * @param {QuadItem} pRect        bounds of the area to be checked, with x,
     *     y, width, height
     * @return number        index of the sub-node (0-3), or -1 if pRect
     *     cannot completely fit within a sub-node and is part of the parent
     *     node
     */
    getIndex(pRect) {
        let index = -1;
        let px = this.bounds_.x + (this.bounds_.width / 2);
        let py = this.bounds_.y + (this.bounds_.height / 2);
        let topQuadrant = (pRect.y < py && pRect.y + pRect.height < py);
        let bottomQuadrant = (pRect.y > py);

        if (pRect.x < px && pRect.x + pRect.width < px) {
            if (topQuadrant) {
                index = 1
            } else if (bottomQuadrant) {
                index = 2
            }
        } else if (pRect.x > px) {
            if (topQuadrant) {
                index = 0
            } else if (bottomQuadrant) {
                index = 3
            }
        }
        return index
    }

    /**
     * Insert the object into the node. If the node
     * exceeds the capacity, it will split and add all
     * objects to their corresponding sub-nodes.
     * @param {QuadItem} pRect  - bounds of the object to be added, with x,y,
     * width, height
     */
    insert(pRect) {
        let i = 0;
        let index;
        if (typeof this.nodes_[0] !== 'undefined') {
            index = this.getIndex(pRect);
            if (index !== -1) {
                this.nodes_[index].insert(pRect);
                return
            }
        }

        this.objects_.push(pRect);

        if (this.objects_.length > this.maxObjects_
            && this.level_ < this.maxLevel_) {
            if (typeof this.nodes_[0] === 'undefined') {
                this.split_()
            }
            while (i < this.objects_.length) {
                index = this.getIndex(this.objects_[i]);
                if (index !== -1) {
                    this.nodes_[index].insert(this.objects_.splice(i, 1)[0])
                } else {
                    i = i + 1
                }
            }
        }
    }

    /**
     * Return all objects that could collide with the given object
     * @param {QuadItem} pRect        bounds of the object to be checked, with
     *     x, y, width, height
     * @Return {Array}        array with all detected objects
     */
    retrieve(pRect) {
        const index = this.getIndex(pRect);
        let returnObjects = this.objects_;
        if (typeof this.nodes_[0] !== 'undefined') {
            if (index !== -1) {
                returnObjects = returnObjects.concat(
                    this.nodes_[index].retrieve(pRect))
            } else {
                for (let i = 0; i < this.nodes_.length; i = i + 1) {
                    returnObjects = returnObjects.concat(
                        this.nodes_[i].retrieve(pRect))
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
        this.objects_ = [];
        for (let i = 0; i < this.nodes_.length; ++i) {
            if (typeof this.nodes_[i] !== 'undefined') {
                this.nodes_[i].clear();
            }
        }
        this.nodes_ = [];
    }
}


/** @interface QuadItem - should only used in Quadtree data structure */
class QuadItem {
    /** @return {number} */
    get x() {}

    /** @return {number} */
    get y() {}

    /** @return {number} */
    get width() {}

    /** @return {number} */
    get height() {}
}
