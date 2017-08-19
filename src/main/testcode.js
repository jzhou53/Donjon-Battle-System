function booooooom(number) {
    for (let i = 0; i < number; i++)
        $gameMap._dynamicEntities.debugCreateEntity();

    const sm = SceneManager._scene._spriteset;
    console.debug(sm);
    EventsManager.queueEvent(new Evnt_SpritesetMapCreated(0, sm));
}