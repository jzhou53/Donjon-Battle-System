/**
 *  Component Class
 *  Super abstract class for all components, provide basic owner to game entities,
 *  @abstract
 */
class Component {

    get owner() {
        return this._owner;
    }

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
         * @private
         */
        this._owner = owner;
    }

    /**
     *
     */
    update() {
        throw new Error("Component update not implemented");
    }


}

