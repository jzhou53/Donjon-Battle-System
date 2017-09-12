/**
 * Base class for all entities in Donjon scenes.
 */
class Game_Object {

    static LAYERS = {
        DEFAULT: 0,
    };

    static TAGS = {
        UNTAGGED: 0,
        RESPAWN: 1,
        PLAYER: 2,
    };

    /**
     * @param name {String} The name that the Game_Object is created with.
     * @param components {Object} A list of Components to add to the Game_Object on creation.
     */
    constructor(name = '', components = {}) {
        /**
         * @type {Game_Object}
         * @protected
         */
        this._parent = null;
        /**
         * @type {Array.<Game_Object>}
         * @private
         */
        this._children = [];
        /**
         * @type {number}
         * @protected
         */
        this._layer = Game_Object.LAYERS.DEFAULT;
        /**
         * @type {number}
         * @protected
         */
        this._tag = Game_Object.TAGS.UNTAGGED;
        /**
         * @type {Unity_Transform}
         * @protected
         */
        this._transform = new Unity_Transform(this);
        /**
         * @type {String}
         * @protected
         */
        this._name = name;
        /**
         * @type {Object}
         * @private
         */
        this._components = components;
        /**
         * @type {boolean}
         * @protected
         */
        this._active = true;
    }

    get transform() {
        return this._transform;
    }

    /**
     *    Finds a Game_Object by name and returns it.
     * @param name {string}
     * @return {Game_Object}
     */
    static find(name) {

    }

    /**
     * @param tag {number}
     * @return {Array.<Game_Object>}
     */
    static findGameObjectsWithTag(tag) {

    }

    /**
     * @param tag {number}
     * @return {Game_Object}
     */
    static findWithTag(tag) {

    }

    /**
     * Adds a component class of type componentType to the game object
     * @param componentType {Component}
     */
    addComponent(componentType) {
        //this._components.push(new componentType());
        //this._components[componentType] = new componentType();
    }

    /**
     * @param tag {number} The tag to compare.
     * @return {boolean} Is this game object tagged with tag ?
     */
    compareTag(tag) {
        return this._tag === tag;
    }

    /**
     *    Calls the method named methodName on every MonoBehaviour in this game object or any of its children.
     * @param methodName {Function}
     * @param parameter {Array}
     */
    broadcastMessage(methodName, parameter = []) {
        //methodName.apply(this, parameter);
        //for each transform and child

    }

    sendMessage(methodName, value) {

    }

    sendMessageUpwards(methodName, value) {

    }

    /**
     * @param type {Component}
     * @return {Component}
     */
    getComponent(type) {

    }

    /**
     * @return {Array.<Component>}
     */
    getComponents() {
        return this._components;
    }

    setActive(active) {
        this._active = active;
    }
}