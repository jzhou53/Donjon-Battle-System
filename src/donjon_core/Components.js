/**
 *  Component Class
 *  Super abstract class for all components, provide basic owner to game entities,
 *  @abstract
 */
class Component {

    /**
     * set the owner when construct the component
     * @param owner {GameEntity}
     */
    constructor(owner) {
        if (!owner) {
            console.error("Creating component without owner.");
        }
        /**
         * A pointer to an game entity who owns this component.
         * @type {GameEntity}
         * @protected
         */
        this._owner = owner;
    }

    /**
     * @abstract
     */
    update() {
        throw new Error("Component::update not implemented");
    }

    /**
     * @return {GameEntity}
     */
    get owner() {
        return this._owner;
    }

}

