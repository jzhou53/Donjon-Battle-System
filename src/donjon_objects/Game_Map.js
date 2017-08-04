/**
 * The game object class for a map. It contains scrolling and passage determination functions.
 */
class Game_Map {
    /**
     * @constructor
     */
    constructor() {
        //basic map info
        /**
         * @type {number}
         */
        this._mapId = 0;
        this._tilesetId = 0;
        this._displayX = 0;
        this._displayY = 0;
        this._nameDisplay = true;
        //scroll
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
        //parallax
        this._parallaxName = '';
        this._parallaxZero = false;
        this._parallaxLoopX = false;
        this._parallaxLoopY = false;
        this._parallaxSx = 0;
        this._parallaxSy = 0;
        this._parallaxX = 0;
        this._parallaxY = 0;
    }

    /**
     * @param mapId
     */
    setup(mapId) {
        if (!$dataMap) {
            throw new Error('The map data is not available');
        }
        this._mapId = mapId;
        this._tilesetId = $dataMap.tilesetId;
        /**
         * @type {number}
         * @private
         */
        this._displayX = 0;
        /**
         * @type {number}
         * @private
         */
        this._displayY = 0;
        //this._setupEvents();
        this._setupScroll();
        this._setupParallax();
        this._needsRefresh = false;
    }

    tileWidth() {
        return 48;
    };

    tileHeight() {
        return 48;
    };

    /**
     * @return {number}
     */
    mapId() {
        return this._mapId;
    }


    displayX() {
        return this._displayX;
    };

    displayY() {
        return this._displayY;
    };

    parallaxName() {
        return this._parallaxName;
    };

    requestRefresh(mapId) {
        this._needsRefresh = true;
    };

    isNameDisplayEnabled() {
        return this._nameDisplay;
    };

    disableNameDisplay() {
        this._nameDisplay = false;
    };

    enableNameDisplay() {
        this._nameDisplay = true;
    };

    _setupScroll() {
        this._scrollDirection = 2;
        this._scrollRest = 0;
        this._scrollSpeed = 4;
    };

    _setupParallax() {
        this._parallaxName = $dataMap.parallaxName || '';
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        this._parallaxLoopX = $dataMap.parallaxLoopX;
        this._parallaxLoopY = $dataMap.parallaxLoopY;
        this._parallaxSx = $dataMap.parallaxSx;
        this._parallaxSy = $dataMap.parallaxSy;
        this._parallaxX = 0;
        this._parallaxY = 0;
    };

    /**
     * @param x {number}
     * @param y {number}
     */
    setDisplayPos(x, y) {

        let endX = this.width() - this.screenTileX();
        this._displayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
        this._parallaxX = this._displayX;

        let endY = this.height() - this.screenTileY();
        this._displayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
        this._parallaxY = this._displayY;

    };

    parallaxOx() {
        if (this._parallaxZero) {
            return this._parallaxX * this.tileWidth();
        } else if (this._parallaxLoopX) {
            return this._parallaxX * this.tileWidth() / 2;
        } else {
            return 0;
        }
    };

    parallaxOy() {
        if (this._parallaxZero) {
            return this._parallaxY * this.tileHeight();
        } else if (this._parallaxLoopY) {
            return this._parallaxY * this.tileHeight() / 2;
        } else {
            return 0;
        }
    };

    tileset() {
        return $dataTilesets[this._tilesetId];
    };

    tilesetFlags() {
        let tileset = this.tileset();
        if (tileset) {
            return tileset.flags;
        } else {
            return [];
        }
    };

    displayName() {
        return $dataMap.displayName;
    };

    /**
     * @return {number}
     */
    width() {
        return $dataMap.width;
    };

    /**
     * @return {number}
     */
    height() {
        return $dataMap.height;
    };

    data() {
        return $dataMap.data;
    };


    screenTileX() {
        return Graphics.width / this.tileWidth();
    };

    screenTileY() {
        return Graphics.height / this.tileHeight();
    };

    adjustX(x) {
        return x - this._displayX;
    };

    adjustY(y) {
        return y - this._displayY;
    };

    xWithDirection(x, d) {
        return x + (d === 6 ? 1 : d === 4 ? -1 : 0);
    };

    yWithDirection(y, d) {
        return y + (d === 2 ? 1 : d === 8 ? -1 : 0);
    };

    deltaX(x1, x2) {
        return x1 - x2;
    };

    deltaY(y1, y2) {
        return y1 - y2;
    };

    distance(x1, y1, x2, y2) {
        return Math.abs(this.deltaX(x1, x2)) + Math.abs(this.deltaY(y1, y2));
    };

    canvasToMapX(x) {
        let tileWidth = this.tileWidth();
        let originX = this._displayX * tileWidth;
        return Math.floor((originX + x) / tileWidth);
    };

    canvasToMapY(y) {
        let tileHeight = this.tileHeight();
        let originY = this._displayY * tileHeight;
        return Math.floor((originY + y) / tileHeight);
    };

    autoplay() {
        if ($dataMap.autoplayBgm) {
            AudioManager.playBgm($dataMap.bgm);
        }
        if ($dataMap.autoplayBgs) {
            AudioManager.playBgs($dataMap.bgs);
        }
    };

    refreshIfNeeded() {
        if (this._needsRefresh) {
            this.refresh();
        }
    };

    refresh() {
        // this.events().forEach(function (event) {
        //     event.refresh();
        // });
        this._needsRefresh = false;
    };

    scrollDown(distance) {
        if (this.height() >= this.screenTileY()) {
            let lastY = this._displayY;
            this._displayY = Math.min(this._displayY + distance,
                this.height() - this.screenTileY());
            this._parallaxY += this._displayY - lastY;
        }
    };

    scrollLeft(distance) {
        if (this.width() >= this.screenTileX()) {
            let lastX = this._displayX;
            this._displayX = Math.max(this._displayX - distance, 0);
            this._parallaxX += this._displayX - lastX;
        }
    };

    scrollRight(distance) {
        if (this.width() >= this.screenTileX()) {
            let lastX = this._displayX;
            this._displayX = Math.min(this._displayX + distance,
                this.width() - this.screenTileX());
            this._parallaxX += this._displayX - lastX;
        }
    };

    scrollUp(distance) {
        if (this.height() >= this.screenTileY()) {
            let lastY = this._displayY;
            this._displayY = Math.max(this._displayY - distance, 0);
            this._parallaxY += this._displayY - lastY;
        }
    };

    isValid(x, y) {
        return x >= 0 && x < this.width() && y >= 0 && y < this.height();
    };

    checkPassage(x, y, bit) {
        let flags = this.tilesetFlags();
        let tiles = this.allTiles(x, y);
        for (let i = 0; i < tiles.length; i++) {
            let flag = flags[tiles[i]];
            if ((flag & 0x10) !== 0)  // [*] No effect on passage
                continue;
            if ((flag & bit) === 0)   // [o] Passable
                return true;
            if ((flag & bit) === bit) // [x] Impassable
                return false;
        }
        return false;
    };

    tileId(x, y, z) {
        let width = $dataMap.width;
        let height = $dataMap.height;
        return $dataMap.data[(z * height + y) * width + x] || 0;
    };

    layeredTiles(x, y) {
        let tiles = [];
        for (let i = 0; i < 4; i++) {
            tiles.push(this.tileId(x, y, 3 - i));
        }
        return tiles;
    };

    allTiles(x, y) {
        return this.layeredTiles(x, y);
    };

    /**
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {number}
     */
    autotileType(x, y, z) {
        let tileId = this.tileId(x, y, z);
        return tileId >= 2048 ? Math.floor((tileId - 2048) / 48) : -1;
    };

    /**
     * @param x {number}
     * @param y {number}
     * @param d {number}
     * @return {Boolean}
     */
    isPassable(x, y, d) {
        return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
    };

    /**
     * @param x {number}
     * @param y {number}
     * @param bit {number}
     * @return {boolean|*}
     */
    checkLayeredTilesFlags(x, y, bit) {
        let flags = this.tilesetFlags();
        return this.layeredTiles(x, y).some(function (tileId) {
            return (flags[tileId] & bit) !== 0;
        });
    };

    isLadder(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x20);
    };

    isBush(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x40);
    };

    isCounter(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x80);
    };

    isDamageFloor(x, y) {
        return this.isValid(x, y) && this.checkLayeredTilesFlags(x, y, 0x100);
    };

    /**
     * @param x {number}
     * @param y {number}
     * @return {*}
     */
    terrainTag(x, y) {
        if (this.isValid(x, y)) {
            let flags = this.tilesetFlags();
            let tiles = this.layeredTiles(x, y);
            for (let i = 0; i < tiles.length; i++) {
                let tag = flags[tiles[i]] >> 12;
                if (tag > 0) {
                    return tag;
                }
            }
        }
        return 0;
    };

    regionId(x, y) {
        return this.isValid(x, y) ? this.tileId(x, y, 5) : 0;
    };

    /**
     * @param direction {number}
     * @param distance {number}
     * @param speed {number}
     */
    startScroll(direction, distance, speed) {
        this._scrollDirection = direction;
        this._scrollRest = distance;
        this._scrollSpeed = speed;
    };

    /**
     * @return {boolean}
     */
    isScrolling() {
        return this._scrollRest > 0;
    };

    /**
     * @param sceneActive {boolean}
     */
    update(sceneActive) {
        this.refreshIfNeeded();
        if (sceneActive) {
            //this.updateInterpreter();
        }
        this._updateScroll();
        //this.updateEvents();
        this._updateParallax();
    };

    _updateScroll() {
        if (this.isScrolling()) {
            let lastX = this._displayX;
            let lastY = this._displayY;
            this.doScroll(this._scrollDirection, this.scrollDistance());
            if (this._displayX === lastX && this._displayY === lastY) {
                this._scrollRest = 0;
            } else {
                this._scrollRest -= this.scrollDistance();
            }
        }
    };

    scrollDistance() {
        return Math.pow(2, this._scrollSpeed) / 256;
    };

    doScroll(direction, distance) {
        switch (direction) {
            case 2:
                this.scrollDown(distance);
                break;
            case 4:
                this.scrollLeft(distance);
                break;
            case 6:
                this.scrollRight(distance);
                break;
            case 8:
                this.scrollUp(distance);
                break;
        }
    };

    _updateParallax() {
        if (this._parallaxLoopX) {
            this._parallaxX += this._parallaxSx / this.tileWidth() / 2;
        }
        if (this._parallaxLoopY) {
            this._parallaxY += this._parallaxSy / this.tileHeight() / 2;
        }
    };

    /**
     * @param tilesetId {number}
     */
    changeTileset(tilesetId) {
        this._tilesetId = tilesetId;
        this.refresh();
    };

    /**
     * @param name {string}
     * @param loopX {number}
     * @param loopY {number}
     * @param sx {number}
     * @param sy {number}
     */
    changeParallax(name, loopX, loopY, sx, sy) {
        this._parallaxName = name;
        this._parallaxZero = ImageManager.isZeroParallax(this._parallaxName);
        if (this._parallaxLoopX && !loopX) {
            this._parallaxX = 0;
        }
        if (this._parallaxLoopY && !loopY) {
            this._parallaxY = 0;
        }
        this._parallaxLoopX = loopX;
        this._parallaxLoopY = loopY;
        this._parallaxSx = sx;
        this._parallaxSy = sy;
    };

}