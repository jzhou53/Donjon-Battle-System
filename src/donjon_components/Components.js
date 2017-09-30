/**
 *  Component Class
 *  Super abstract class for all components, provide basic owner to game
 * entities,
 *  @abstract
 */
class Component {

    /**
     * set the owner when construct the component
     * @param owner {Game_Object}
     */
    constructor(owner) {
        if (!owner) {
            console.error("Creating component without owner.");
        }
        /**
         * A pointer to an game entity who owns this component.
         * @type {Game_Object}
         * @protected
         */
        this.owner_ = owner;
        this.setupListeners_();
    }

    /** @return {Game_Object} */
    get owner() { return this.owner_ }

    /** @abstract */
    update() { throw new Error("Component::update not implemented") }

    /** @protected @abstract */
    setupListeners_() {}
}

