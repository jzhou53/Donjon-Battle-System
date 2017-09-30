/**
 *  Component Class
 *  Super abstract class for all components, provide basic owner to game
 * entities,
 *  @abstract
 */
class Component {

    /**
     * set the owner when construct the component
     * @param owner {GameObject}
     */
    constructor(owner) {
        if (!owner) {
            console.error("Creating component without owner.");
        }
        /**
         * A pointer to an game entity who owns this component.
         * @type {GameObject}
         * @protected
         */
        this.owner_ = owner;
        this.setupListeners_();
    }

    /** @return {GameObject} */
    get owner() { return this.owner_ }

    /** @abstract */
    update() { throw new Error("Component::update not implemented") }

    /** @protected @abstract */
    setupListeners_() {}
}

