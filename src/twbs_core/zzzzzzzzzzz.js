function QtreeChecker() {
    // let s = new Manager_DynamicEntity();
    // s.debugCreateEntity();
    // s.debugCreateEntity();
    // s.debugCreateEntity();
    // s.debugCreateEntity();
    // s.debugCreateEntity();
    // s.update();
    let evntManager = new EventManager();
    let testEvnt0 = new BasicEvent(1);
    let testEvnt1 = new BasicEvent(1);
    let testEvnt2 = new BasicEvent(2);
    let testEvnt3 = new BasicEvent(2);
    let testEvnt4 = new BasicEvent(2);

    evntManager.addListener(1,function () {
        console.log("Bing Go !!!");
    });
    evntManager.addListener(2,function () {
        console.log("Fuck You !!!");
    });
    evntManager.queueEvent(testEvnt0);
    evntManager.queueEvent(testEvnt1);
    evntManager.queueEvent(testEvnt2);
    evntManager.queueEvent(testEvnt3);
    evntManager.queueEvent(testEvnt4);
    console.log(evntManager);



}