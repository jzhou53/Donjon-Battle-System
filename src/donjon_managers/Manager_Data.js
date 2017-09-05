/**
 * The static class that manages the database and game objects.
 */
class DataManager {

    /**
     * @type {string}
     * @private
     */
    static _globalId = 'RPGMV';
    /**
     * @type {number}
     * @private
     */
    static _lastAccessedId = 1;

    /**
     * @type {String}
     * @private
     */
    static _errorUrl = null;

    /**
     * @type {Array}
     * @private
     */
    static _databaseFiles = [
        {name: '$dataTilesets', src: 'Tilesets.json'},
        {name: '$dataSystem', src: 'System.json'},
        {name: '$dataMapInfos', src: 'MapInfos.json'},
        //custom data
        {name: '$dataArmors', src: 'Donjon_Armors.json'},
        {name: '$dataWeapons', src: 'Donjon_Weapons.json'},
        {name: '$dataBattlers', src: 'Donjon_Battlers.json'}
    ];

    /**
     * @constructor
     */
    constructor() {
        throw new Error("This is a static class");
    }

    /**
     * @static
     */
    static loadDatabase() {
        for (let i = 0; i < this._databaseFiles.length; i++) {
            let name = this._databaseFiles[i].name;
            let src = this._databaseFiles[i].src;
            this._loadDataFile(name, src);
        }
    }

    /**
     * @param name {String} global letiable name
     * @param src {String} name of the source json file
     * @private
     */
    static _loadDataFile(name, src) {
        const xhr = new XMLHttpRequest();
        const url = 'data/' + src;
        xhr.open('GET', url);
        xhr.overrideMimeType('application/json');
        xhr.onload = function () {
            if (xhr.status < 400) {
                window[name] = JSON.parse(xhr.responseText);
                DataManager.onLoad(window[name]);
            }
        };
        xhr.onerror = function () {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        window[name] = null;
        xhr.send();
    }

    /**
     * @return {boolean}
     */
    static isDatabaseLoaded() {
        this._checkError();
        for (let i = 0; i < this._databaseFiles.length; i++) {
            if (!window[this._databaseFiles[i].name]) {
                return false;
            }
        }
        return true;
    }

    /**
     * @param mapId {Number}
     */
    static loadMapData(mapId) {
        if (mapId > 0) {
            const filename = 'Map%1.json'.format(mapId.padZero(3));
            this._loadDataFile('$dataMap', filename);
        } else {
            this._makeEmptyMap();
        }
    }

    /**
     * @private
     */
    static _makeEmptyMap() {
        $dataMap = {};
        $dataMap.data = [];
        $dataMap.events = [];
        $dataMap.width = 100;
        $dataMap.height = 100;
        $dataMap.scrollType = 3;
    }

    static isMapLoaded() {
        this._checkError();
        return !!$dataMap;
    }

    /**
     * @param object {object}
     */
    static onLoad(object) {
        let array;
        if (object === $dataMap) {
            this.extractMetadata(object);
            array = object.events;
        } else {
            array = object;
        }
        if (Array.isArray(array)) {
            for (let i = 0; i < array.length; i++) {
                let data = array[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
        if (object === $dataSystem) {
            Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
            Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
            Scene_Boot.loadSystemImages();
        }
    }

    /**
     * @param data{Object}
     */
    static extractMetadata(data) {
        let re = /<([^<>:]+)(:?)([^>]*)>/g;
        data.meta = {};
        for (; ;) {
            let match = re.exec(data.note);
            if (match) {
                if (match[2] === ':') {
                    data.meta[match[1]] = match[3];
                } else {
                    data.meta[match[1]] = true;
                }
            } else {
                break;
            }
        }
    }

    /**
     * @private
     */
    static _checkError() {
        if (DataManager._errorUrl) {
            throw new Error('Failed to load: ' + DataManager._errorUrl);
        }
    }

    /**
     * @param item
     * @return {*|boolean|{enumerable, value}|Boolean}
     */
    // static isArmor(item) {
    //     return item && $dataArmors.contains(item);
    // }

    /**
     * @private
     */
    static _createGameObjects() {
        //$gameTemp = new Game_Temp();
        $gameSystem = new Game_System();
        $gameScreen = new Game_Screen();

        /**
         * @type {Game_Map}
         */
        $gameMap = new Game_BattleMap();
    }

    /**
     * @public
     */
    static setupNewGame() {
        this._createGameObjects();
        this.selectSavefileForNewGame();
        // $gameParty.setupStartingMembers();
        // $gamePlayer.reserveTransfer($dataSystem.startMapId,
        //     $dataSystem.startX, $dataSystem.startY);
        Graphics.frameCount = 0;
    }

    /**
     * @return {Array}
     */
    static loadGlobalInfo() {
        let json;
        try {
            json = StorageManager.load(0);
        } catch (e) {
            console.error(e);
            return [];
        }
        if (json) {
            let globalInfo = JSON.parse(json);
            for (let i = 1; i <= this.maxSavefiles(); i++) {
                if (!StorageManager.exists(i)) {
                    delete globalInfo[i];
                }
            }
            return globalInfo;
        } else {
            return [];
        }
    }

    /**
     * @param info {json}
     */
    static saveGlobalInfo(info) {
        StorageManager.save(0, JSON.stringify(info));
    }

    /**
     * @param savefileId {Number}
     * @return {boolean}
     */
    static isThisGameFile(savefileId) {
        let globalInfo = this.loadGlobalInfo();
        if (globalInfo && globalInfo[savefileId]) {
            if (StorageManager.isLocalMode()) {
                return true;
            } else {
                let savefile = globalInfo[savefileId];
                return (savefile.globalId === this._globalId &&
                    savefile.title === $dataSystem.gameTitle);
            }
        } else {
            return false;
        }
    }

    /**
     * @return {boolean}
     */
    static isAnySavefileExists() {
        let globalInfo = this.loadGlobalInfo();
        if (globalInfo) {
            for (let i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @return {number}
     */
    static latestSavefileId() {
        let globalInfo = this.loadGlobalInfo();
        let savefileId = 1;
        let timestamp = 0;
        if (globalInfo) {
            for (let i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
                    timestamp = globalInfo[i].timestamp;
                    savefileId = i;
                }
            }
        }
        return savefileId;
    }

    static loadAllSavefileImages() {
        let globalInfo = this.loadGlobalInfo();
        if (globalInfo) {
            for (let i = 1; i < globalInfo.length; i++) {
                if (this.isThisGameFile(i)) {
                    let info = globalInfo[i];
                    this.loadSavefileImages(info);
                }
            }
        }
    }

    static loadSavefileImages() {
        if (info.characters) {
            for (let i = 0; i < info.characters.length; i++) {
                ImageManager.loadCharacter(info.characters[i][0]);
            }
        }
        if (info.faces) {
            for (let j = 0; j < info.faces.length; j++) {
                ImageManager.loadFace(info.faces[j][0]);
            }
        }
    }

    /**
     * @return {number}
     */
    static maxSavefiles() {
        return 20;
    }

    /**
     * @param savefileId {number}
     * @return {boolean}
     */
    static saveGame(savefileId) {
        try {
            StorageManager.backup(savefileId);
            return this.saveGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            try {
                StorageManager.remove(savefileId);
                StorageManager.restoreBackup(savefileId);
            } catch (e2) {
            }
            return false;
        }
    }

    /**
     * @param savefileId {Number}
     * @return {boolean}
     */
    static loadGame(savefileId) {
        try {
            return this.loadGameWithoutRescue(savefileId);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * @param savefileId {number}
     * @return {null}
     */
    static loadSavefileInfo(savefileId) {
        let globalInfo = this.loadGlobalInfo();
        return (globalInfo && globalInfo[savefileId]) ? globalInfo[savefileId] : null;
    }

    /**
     * @return {number}
     */
    static lastAccessedSavefileId() {
        return this._lastAccessedId;
    }

    /**
     * @param savefileId {number}
     * @return {boolean}
     */
    static saveGameWithoutRescue(savefileId) {
        let json = JsonEx.stringify(this.makeSaveContents());
        if (json.length >= 200000) {
            console.warn('Save data too big!');
        }
        StorageManager.save(savefileId, json);
        this._lastAccessedId = savefileId;
        let globalInfo = this.loadGlobalInfo() || [];
        globalInfo[savefileId] = this.makeSavefileInfo();
        this.saveGlobalInfo(globalInfo);
        return true;
    }

    /**
     * @param savefileId
     * @return {boolean}
     */
    static loadGameWithoutRescue(savefileId) {
        let globalInfo = this.loadGlobalInfo();
        if (this.isThisGameFile(savefileId)) {
            let json = StorageManager.load(savefileId);
            this._createGameObjects();
            this.extractSaveContents(JsonEx.parse(json));
            this._lastAccessedId = savefileId;
            return true;
        } else {
            return false;
        }
    }

    static selectSavefileForNewGame() {
        let globalInfo = this.loadGlobalInfo();
        this._lastAccessedId = 1;
        if (globalInfo) {
            let numSavefiles = Math.max(0, globalInfo.length - 1);
            if (numSavefiles < this.maxSavefiles()) {
                this._lastAccessedId = numSavefiles + 1;
            } else {
                let timestamp = Number.MAX_VALUE;
                for (let i = 1; i < globalInfo.length; i++) {
                    if (!globalInfo[i]) {
                        this._lastAccessedId = i;
                        break;
                    }
                    if (globalInfo[i].timestamp < timestamp) {
                        timestamp = globalInfo[i].timestamp;
                        this._lastAccessedId = i;
                    }
                }
            }
        }
    }

    /**
     * @return {{}}
     */
    static makeSavefileInfo() {
        let info = {};
        info.globalId = this._globalId;
        info.title = $dataSystem.gameTitle;
        //info.characters = $gameParty.charactersForSavefile();
        //info.faces = $gameParty.facesForSavefile();
        info.playtime = $gameSystem.playtimeText();
        info.timestamp = Date.now();
        return info;
    }

    /**
     * @return {{}}
     */
    static makeSaveContents() {
        // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
        const contents = {};
        contents.system = $gameSystem;
        contents.screen = $gameScreen;
        contents.map = $gameMap;
        return contents;
    }

    /**
     * @param contents
     */
    static extractSaveContents(contents) {
        $gameSystem = contents.system;
        $gameScreen = contents.screen;
        $gameMap = contents.map;

    }


}