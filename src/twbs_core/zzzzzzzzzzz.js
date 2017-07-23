/**
 * @global
 * @type {EventManager}
 */
const $eventManager = new EventManager();
const $dynamicEntitiesManager = new Manager_DynamicEntity();


function QtreeChecker(x = 0, y = 0) {

    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();
    $dynamicEntitiesManager.debugCreateEntity();

    //s.debugShowAllEntity();
    //s.update();
    checkQ(x,y);


}


function checkQ(x = 0,y = 0) {
    $dynamicEntitiesManager.debugDisplayQuadtree(x,y);
}