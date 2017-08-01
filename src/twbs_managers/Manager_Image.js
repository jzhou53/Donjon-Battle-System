/**
 * The static class that loads images, creates bitmap objects and retains them.
 */
class ImageManager {
    /**
     * the most significant Map data structure caching bitmaps
     * @type {CacheMap}
     */
    static cache = new CacheMap(ImageManager);
    constructor(){
        throw new Error('This is a static class');
    }

    /**
     * @param filename {String}
     * @param hue {int}
     */
    static loadCharacter(filename, hue){
        return this.loadBitmap('img/characters/', filename, hue, false);
    }

    /**
     * @param filename {String}
     * @param hue {int}
     */
    static loadParallax(filename, hue){
        return this.loadBitmap('img/parallaxes/', filename, hue, false);
    }

    /**
     * @param filename {String}
     * @param hue {int}
     */
    static loadSystem(filename, hue){
        return this.loadBitmap('img/system/', filename, hue, false);
    }

    /**
     * @param filename {String}
     * @param hue {int}
     */
    static loadTileset(filename, hue){
        return this.loadBitmap('img/tilesets/', filename, hue, false);
    }

    /**
     * @param folder {String}
     * @param filename {String}
     * @param hue {int}
     * @param smooth
     */
    static loadBitmap(folder, filename, hue, smooth){
        if (filename) {
            let path = folder + encodeURIComponent(filename) + '.png';
            let bitmap = this.loadNormalBitmap(path, hue || 0);
            bitmap.smooth = smooth;
            return bitmap;
        } else {
            return this.loadEmptyBitmap();
        }
    }

    /**
     * @return {Bitmap|null}
     */
    static loadEmptyBitmap(){
        let empty = this.cache.getItem('empty');
        if (!empty) {
            empty = new Bitmap();
            this.cache.setItem('empty', empty);
        }
        return empty;
    }

    /**
     * @param path {string}
     * @param hue {int}
     * @return {Bitmap|null}
     */
    static loadNormalBitmap(path, hue){
        let key = path + ':' + hue;
        let bitmap = this.cache.getItem(key);
        if (!bitmap) {
            bitmap = Bitmap.load(path);
            bitmap.addLoadListener(function() {
                bitmap.rotateHue(hue);
            });
            this.cache.setItem(key, bitmap);
        }
        return bitmap;
    }

    static clear(){
        this.cache.clear();
    }

    /**
     * @return {boolean}
     */
    static isReady(){
        for (let key in this.cache._inner) {
            let bitmap = this.cache._inner[key].item;
            if (bitmap.isError()) {
                throw new Error('Failed to load: ' + bitmap.url);
            }
            if (!bitmap.isReady()) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param filename string
     * @return {Boolean}
     */
    static isObjectCharacter(filename){
        // language=JSRegexp
        const sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('!');
    }

    /**
     * @param filename string
     * @return {Boolean}
     */
    static isBigCharacter(filename){
        // language=JSRegexp
        const sign = filename.match(/^[\!\$]+/);
        return sign && sign[0].contains('$');
    }

    /**
     * @param filename string
     * @return {boolean}
     */
    static isZeroParallax(filename){
        return filename.charAt(0) === '!';
    }

}