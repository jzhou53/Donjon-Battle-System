/**
 * @extends Game_Map
 */
class Game_BattleMap extends Game_Map {

    constructor() {
        super();
        /** @private @type {Manager_DynamicEntity} */
        this._dynamicEntities = null;

        /** @private @type {Manager_BattleField} */
        this._battleField = null;
    }

    /**
     * @override
     * @param mapId
     */
    setup(mapId) {
        super.setup(mapId);
        //set up static manager

        //set up dynamic entity manager
        // this.setupDynamicManager_();
        // this.setupBattleField_();

        //temp==================================================
        //this._interpreter = new Donjon_Interpreter($dataMap);
        this._debugObjects = [];
        this._debugObjects.push(this.createDebugObject(8, 5));
        this._debugObjects.push(this.createDebugObject(10, 6));
        this._debugObjects.push(this.createDebugObject(11, 6));

        this._tempPhysics = new Simple_Physics();
        let colliders = [];

        //collecting collider components
        for (const object of this._debugObjects) {
            for (const c of object.getComponents(CircleCollider)) {
                colliders.push(c);
            }
        }
        this._tempPhysics.setup(colliders);
        //======================================================
    }

    /**
     * @param x
     * @param y
     * @return {Game_Object}
     */
    createDebugObject(x, y) {
        let actor = new Game_Object();
        actor.addComponent(Rigidbody);
        actor.addComponent(CircleCollider);
        actor.getComponent(CircleCollider).attachedRigidbody = actor.getComponent(Rigidbody);
        actor.addComponent(CharacterRenderComponent);
        //identity
        actor.tag = Game_Object.Tags.PLAYER;
        //transform
        actor.transform.position.x = x;
        actor.transform.position.y = y;

        //add god's first force
        actor.getComponent(Rigidbody).addForce(new Victor(3,0));
        return actor;
    }

    /** @private */
    setupDynamicManager_() {
        this._dynamicEntities = new Manager_DynamicEntity(
            this.width(), this.height());
        this._dynamicEntities.setup(this.mapId());
    }

    /** @private */
    setupBattleField_() {
        this._battleField = new Manager_BattleField(this._dynamicEntities);
    }

    /**
     * @param sceneActive{boolean}
     */
    update(sceneActive) {
        super.update(sceneActive);

        // this._dynamicEntities.update();
        // this._battleField.update();

        //temp
        const delta_time = 1.0 / 60.0;

        this._tempPhysics.simulate(delta_time);


        //temp -----------------------------------
        //console.log(Input.dirVictor.toString());
        let player = this._debugObjects[0];
        let test_speed = 4.0;

        let direction = Input.dirVictor.clone();

        let delta_pos = new Victor();
        let rigidbody = player.getComponent(Rigidbody);


        if (!direction.isZero()) {
            //direction.normalize(); //this make sure player move at the same
            // speed in all direction
            delta_pos = direction.multiplyScalar(test_speed);

            //rigidbody.velocity_.limit(3.0,0.9);

            //rigidbody.velocity_.add(delta_pos.multiplyScalar(delta_time));

            rigidbody.movePosition(delta_pos.multiplyScalar(delta_time).add(player.transform.position));
            //player.transform.translate(delta_pos.multiplyScalar(delta_time));
        } else {
            rigidbody.velocity.zero();
        }

        // if (player.transform.position.x > 7){
        //     let v = new Victor(-20,0);
        //     rigidbody.addForce(v.multiplyScalar(delta_time));
        // }else{
        //     //let v =
        // rigidbody.velocity_.clone().invert().multiplyScalar(0.1);
        // //rigidbody.velocity_.add(v); }

        rigidbody.update(delta_time);

        //let pos = player.transform.position;
        //console.log(pos.toString() + ": "+ this.isEqual(pos.x,
        // Math.round(pos.x)));

    }


}