/**
 * @global
 * @type {EventManager}
 */
const $eventManager = new EventManager();
const $dynamicEntitiesManager = new Manager_DynamicEntity();


function QtreeChecker(x = 0, y = 0) {

    // $dynamicEntitiesManager.debugCreateEntity();
    // $dynamicEntitiesManager.debugCreateEntity();
    // $dynamicEntitiesManager.debugCreateEntity();
    // $dynamicEntitiesManager.debugCreateEntity();
    // $dynamicEntitiesManager.debugCreateEntity();
    //
    // checkQ(x,y);
    let time = performance.now();
    let t1 = new Transform(new Victor(5,5));
    let t2 = new Transform(new Victor(0,0));
    let t3 = new Transform(new Victor(1,1));
    let t4 = new Transform(new Victor(5,5));

    t4.attachWith(t3);
    t3.attachWith(t1);
    t2.attachWith(t1);

    t1.update();
    t2.update();
    t3.update();
    t4.update();
    console.log("t1: "+t1.toString());
    console.log("t2: "+t2.toString());
    console.log("t3: "+t3.toString());
    console.log("t4: "+t4.toString());
    let time2 = performance.now();
    console.log(time2-time);



}


function checkQ(x = 0,y = 0) {
    $dynamicEntitiesManager.debugDisplayQuadtree(x,y);
}