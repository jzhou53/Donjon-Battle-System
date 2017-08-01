/**
 * @global
 * @type {EventManager}
 */
const $eventManager = new EventManager();
const $dynamicEntitiesManager = new Manager_DynamicEntity();

function createQtree() {

    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();


}

function boom(){
    const arr = $dynamicEntitiesManager._entities;
    const entity = arr[Math.randomInt(arr.length)];
    entity._components.get("Physics").addImpactForce(new Victor(Math.randomInt(100)-50,Math.randomInt(100)-50))
}


function updateQtree() {
    $dynamicEntitiesManager.update();
}

