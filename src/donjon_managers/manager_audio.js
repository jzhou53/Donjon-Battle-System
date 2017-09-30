/**
 * The static class that handles BGM, BGS, ME and SE.
 */
class AudioManager {

    static _bgmVolume = 100;
    static _bgsVolume = 100;
    static _meVolume = 100;
    static _seVolume = 100;
    /**
     * @type {{name, volume, pitch: (Number|*|number), pan: (Number|*), pos: *}|null}
     * @private
     */
    static _currentBgm = null;
    static _currentBgs = null;
    static _bgmBuffer = null;
    static _bgsBuffer = null;
    static _meBuffer = null;
    static _seBuffers = [];
    static _staticBuffers = [];
    static _replayFadeTime = 0.5;
    static _path = 'audio/';
    static _blobUrl = null;

    constructor() {
        throw new Error('This is a static class');
    }

    /**
     * @return {number}
     */
    static get bgmVolume() {
        return this._bgmVolume;
    }

    // noinspection JSAnnotator
    /**
     * @param value{number}
     */
    static set bgmVolume(value) {
        this._bgmVolume = value;
        this.updateBgmParameters(this._currentBgm);
    }

    /**
     * @return {number}
     */
    static get bgsVolume() {
        return this._bgsVolume;
    }

    // noinspection JSAnnotator
    /**
     * @param value{number}
     */
    static set bgsVolume(value) {
        this._bgsVolume = value;
        this.updateBgsParameters(this._currentBgs);
    }

    /**
     * @return {number}
     */
    static get meVolume() {
        return this._meVolume;
    }

    // noinspection JSAnnotator
    /**
     * @param value{number}
     */
    static set meVolume(value) {
        this._meVolume = value;
        this.updateMeParameters(this._currentMe);
    }

    /**
     * @return {number}
     */
    static get seVolume() {
        return this._seVolume;
    }

    /**
     * @param value{number}
     */
    static set seVolume(value) {
        this._seVolume = value;
    }

    static playBgm(bgm, pos) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.stopBgm();
            if (bgm.name) {
                if (Decrypter.hasEncryptedAudio && this.shouldUseHtml5Audio()) {
                    this.playEncryptedBgm(bgm, pos);
                }
                else {
                    this._bgmBuffer = this.createBuffer('bgm', bgm.name);
                    this.updateBgmParameters(bgm);
                    if (!this._meBuffer) {
                        this._bgmBuffer.play(true, pos || 0);
                    }
                }
            }
        }
        this.updateCurrentBgm(bgm, pos);
    }

    static playEncryptedBgm(bgm, pos) {
        let ext = this.audioFileExt();
        let url = this._path + 'bgm/' + encodeURIComponent(bgm.name) + ext;
        url = Decrypter.extToEncryptExt(url);
        Decrypter.decryptHTML5Audio(url, bgm, pos);
    }

    static createDecryptBuffer(url, bgm, pos) {
        this._blobUrl = url;
        this._bgmBuffer = this.createBuffer('bgm', bgm.name);
        this.updateBgmParameters(bgm);
        if (!this._meBuffer) {
            this._bgmBuffer.play(true, pos || 0);
        }
        this.updateCurrentBgm(bgm, pos);
    }

    static replayBgm(bgm) {
        if (this.isCurrentBgm(bgm)) {
            this.updateBgmParameters(bgm);
        } else {
            this.playBgm(bgm, bgm.pos);
            if (this._bgmBuffer) {
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static isCurrentBgm(bgm) {
        return (this._currentBgm && this._bgmBuffer &&
            this._currentBgm.name === bgm.name);
    }

    static updateBgmParameters(bgm) {
        this.updateBufferParameters(this._bgmBuffer, this._bgmVolume, bgm);
    }

    static updateCurrentBgm(bgm, pos) {
        this._currentBgm = {
            name: bgm.name,
            volume: bgm.volume,
            pitch: bgm.pitch,
            pan: bgm.pan,
            pos: pos
        }
    }

    static stopBgm() {
        if (this._bgmBuffer) {
            this._bgmBuffer.stop();
            this._bgmBuffer = null;
            this._currentBgm = null;
        }
    }

    static fadeOutBgm(duration) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeOut(duration);
            this._currentBgm = null;
        }
    }

    static fadeInBgm(duration) {
        if (this._bgmBuffer && this._currentBgm) {
            this._bgmBuffer.fadeIn(duration);
        }
    }

    static playBgs(bgs, pos) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.stopBgs();
            if (bgs.name) {
                this._bgsBuffer = this.createBuffer('bgs', bgs.name);
                this.updateBgsParameters(bgs);
                this._bgsBuffer.play(true, pos || 0);
            }
        }
        this.updateCurrentBgs(bgs, pos);
    }

    static replayBgs(bgs) {
        if (this.isCurrentBgs(bgs)) {
            this.updateBgsParameters(bgs);
        } else {
            this.playBgs(bgs, bgs.pos);
            if (this._bgsBuffer) {
                this._bgsBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static isCurrentBgs(bgs) {
        return (this._currentBgs && this._bgsBuffer &&
            this._currentBgs.name === bgs.name);
    }

    static updateBgsParameters(bgs) {
        this.updateBufferParameters(this._bgsBuffer, this._bgsVolume, bgs);
    }

    static updateCurrentBgs(bgs, pos) {
        this._currentBgs = {
            name: bgs.name,
            volume: bgs.volume,
            pitch: bgs.pitch,
            pan: bgs.pan,
            pos: pos
        }
    }

    static stopBgs() {
        if (this._bgsBuffer) {
            this._bgsBuffer.stop();
            this._bgsBuffer = null;
            this._currentBgs = null;
        }
    }

    static fadeOutBgs(duration) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeOut(duration);
            this._currentBgs = null;
        }
    }

    static fadeInBgs(duration) {
        if (this._bgsBuffer && this._currentBgs) {
            this._bgsBuffer.fadeIn(duration);
        }
    }

    static playMe(me) {
        this.stopMe();
        if (me.name) {
            if (this._bgmBuffer && this._currentBgm) {
                this._currentBgm.pos = this._bgmBuffer.seek();
                this._bgmBuffer.stop();
            }
            this._meBuffer = this.createBuffer('me', me.name);
            this.updateMeParameters(me);
            this._meBuffer.play(false);
            this._meBuffer.addStopListener(this.stopMe.bind(this));
        }
    }

    static updateMeParameters(me) {
        this.updateBufferParameters(this._meBuffer, this._meVolume, me);
    }

    static fadeOutMe(duration) {
        if (this._meBuffer) {
            this._meBuffer.fadeOut(duration);
        }
    }

    static stopMe() {
        if (this._meBuffer) {
            this._meBuffer.stop();
            this._meBuffer = null;
            if (this._bgmBuffer && this._currentBgm && !this._bgmBuffer.isPlaying()) {
                this._bgmBuffer.play(true, this._currentBgm.pos);
                this._bgmBuffer.fadeIn(this._replayFadeTime);
            }
        }
    }

    static playSe(se) {
        if (se.name) {
            this._seBuffers = this._seBuffers.filter(function (audio) {
                return audio.isPlaying();
            });
            let buffer = this.createBuffer('se', se.name);
            this.updateSeParameters(buffer, se);
            buffer.play(false);
            this._seBuffers.push(buffer);
        }
    }

    static updateSeParameters(buffer, se) {
        this.updateBufferParameters(buffer, this._seVolume, se);
    }

    static stopSe() {
        this._seBuffers.forEach(function (buffer) {
            buffer.stop();
        });
        this._seBuffers = [];
    }

    static playStaticSe(se) {
        if (se.name) {
            this.loadStaticSe(se);
            for (let i = 0; i < this._staticBuffers.length; i++) {
                let buffer = this._staticBuffers[i];
                if (buffer._reservedSeName === se.name) {
                    buffer.stop();
                    this.updateSeParameters(buffer, se);
                    buffer.play(false);
                    break;
                }
            }
        }
    }

    static loadStaticSe(se) {
        if (se.name && !this.isStaticSe(se)) {
            let buffer = this.createBuffer('se', se.name);
            buffer._reservedSeName = se.name;
            this._staticBuffers.push(buffer);
            if (this.shouldUseHtml5Audio()) {
                Html5Audio.setStaticSe(buffer._url);
            }
        }
    }

    static isStaticSe(se) {
        for (let i = 0; i < this._staticBuffers.length; i++) {
            let buffer = this._staticBuffers[i];
            if (buffer._reservedSeName === se.name) {
                return true;
            }
        }
        return false;
    }

    static stopAll() {
        this.stopMe();
        this.stopBgm();
        this.stopBgs();
        this.stopSe();
    }

    static saveBgm() {
        if (this._currentBgm) {
            let bgm = this._currentBgm;
            return {
                name: bgm.name,
                volume: bgm.volume,
                pitch: bgm.pitch,
                pan: bgm.pan,
                pos: this._bgmBuffer ? this._bgmBuffer.seek() : 0
            }
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    static saveBgs() {
        if (this._currentBgs) {
            let bgs = this._currentBgs;
            return {
                name: bgs.name,
                volume: bgs.volume,
                pitch: bgs.pitch,
                pan: bgs.pan,
                pos: this._bgsBuffer ? this._bgsBuffer.seek() : 0
            }
        } else {
            return this.makeEmptyAudioObject();
        }
    }

    static makeEmptyAudioObject() {
        return {name: '', volume: 0, pitch: 0};
    }

    static createBuffer(folder, name) {
        let ext = this.audioFileExt();
        let url = this._path + folder + '/' + encodeURIComponent(name) + ext;
        if (this.shouldUseHtml5Audio() && folder === 'bgm') {
            if (this._blobUrl) Html5Audio.setup(this._blobUrl);
            else Html5Audio.setup(url);
            return Html5Audio;
        } else {
            return new WebAudio(url);
        }
    }

    static updateBufferParameters(buffer, configVolume, audio) {
        if (buffer && audio) {
            buffer.volume = configVolume * (audio.volume || 0) / 10000;
            buffer.pitch = (audio.pitch || 0) / 100;
            buffer.pan = (audio.pan || 0) / 100;
        }
    }

    static audioFileExt() {
        if (WebAudio.canPlayOgg() && !Utils.isMobileDevice()) {
            return '.ogg';
        } else {
            return '.m4a';
        }
    }

    static shouldUseHtml5Audio() {
        // The only case where we wanted html5audio was android/ no encrypt
        // Atsuma-ru asked to force webaudio there too, so just return false for ALL    // return Utils.isAndroidChrome() && !Decrypter.hasEncryptedAudio;
        return false;
    }

    static checkErrors() {
        this.checkWebAudioError(this._bgmBuffer);
        this.checkWebAudioError(this._bgsBuffer);
        this.checkWebAudioError(this._meBuffer);
        this._seBuffers.forEach(function (buffer) {
            this.checkWebAudioError(buffer);
        }.bind(this));
        this._staticBuffers.forEach(function (buffer) {
            this.checkWebAudioError(buffer);
        }.bind(this));
    }

    static checkWebAudioError(webAudio) {
        if (webAudio && webAudio.isError()) {
            throw new Error('Failed to load: ' + webAudio.url);
        }
    }


}