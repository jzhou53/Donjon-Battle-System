/**
 * Base class for all entities in Donjon scenes.
 */
class Game_Object {

    /** @enum {number} */
    static Layers = {
        DEFAULT: 0x0000,
    };

    /** @enum {number} */
    static Tags = {
        UNTAGGED: 0x0000,
        RESPAWN: 0x0001,
        PLAYER: 0x0002,
    };

    /**
     * @param name {String} The name that the Game_Object is created with.
     */
    constructor(name = 'unnamed') {
        /** @private @type{number} */
        this.id_ = Utils.generateRuntimeId();

        /** @private @type {Game_Object} */
        this.parent_ = null;

        /** @private @type {Array.<Game_Object>} */
        this.children_ = [];

        /** @private @type {Game_Object.Layers|number} */
        this.layer_ = Game_Object.Layers.DEFAULT;

        /** @private @type {Game_Object.Tags|number} */
        this.tag_ = Game_Object.Tags.UNTAGGED;

        /** @private @type {Unity_Transform} */
        this.transform_ = new Unity_Transform(this);

        /** @private @type {String} */
        this._name = name === 'unnamed' ? 'unnamed' + this.id : name;

        /** @private @const @type {Object} */
        this.components_ = {};

        /** @private @type {Object} */
        this.behaviours_ = [];

        /** @private @type {boolean} */
        this.active_ = true;
    }

    /** @return {number} */
    get id() { return this.id_ }

    /** @return {Unity_Transform} */
    get transform() { return this.transform_ }

    /** @return {Game_Object.Layers|number} */
    get layer() { return this.layer_ }

    /** @return {Game_Object.Tags|number} */
    get tag() { return this.tag_ }

    /** @param value {Game_Object.Tags|number} */
    set tag(value) { this.tag_ = value }

    /**
     *  Finds a Game_Object by name and returns it.
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
     * @param type {Function}
     */
    addComponent(type) {
        let type_name = type.name;
        let comp = this.components_[type_name];
        if (typeof comp === 'object') {
            if (!Array.isArray(comp)) {
                let temp = comp;
                this.components_[type_name] = [];
                this.components_[type_name].push(temp);
            }
            this.components_[type_name].push(new type(this));
        } else {
            this.components_[type_name] = new type(this);
        }
    }

    /**
     * @param type
     * @return {Component}
     */
    getComponent(type) {
        let comp = this.components_[type.name];
        if (!comp) {
            throw new Error("Attempted to get a Component that does not exist.");
        }
        return Array.isArray(comp) ? comp[0] : comp;
    }

    /**
     * @param type {Function}
     * @return {Array.<Component>}
     */
    getComponents(type) {
        let component = this.components_[type.name];
        if (component) {
            return Array.isArray(component) ? component : [component];
        } else {
            return [];
        }
    }

    /** @param active{boolean} */
    setActive(active) {
        this.active_ = active;
    }

    /**
     * @param tag {number} The tag to compare.
     * @return {boolean} Is this game object tagged with tag ?
     */
    compareTag(tag) {
        return this.tag_ === tag;
    }

    /**
     *    Calls the method named methodName on every MonoBehaviour in this game
     * object or any of its children.
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

}