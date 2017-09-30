//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the keyboard and gamepads.
 *
 * @class Input
 */
class Input {

    static get dir4() {
        return this._dir4
    }

    static get dir8() {
        return this._dir8
    }

    static get dirVictor() {
        return this._dirVictor
    }

    static get date() {
        return this._date
    }

    constructor() {
        throw new Error('This is a static class');
    }

    /**
     * Initializes the input system.
     *
     * @static
     * @method initialize
     */
    static initialize() {
        this.clear();
        this._wrapNwjsAlert();
        this._setupEventHandlers();
    };

    /**
     * The wait time of the key repeat in frames.
     *
     * @static
     * @property keyRepeatWait
     * @type Number
     */
    static KEY_REPEAT_WAIT = 24;

    /**
     * The interval of the key repeat in frames.
     *
     * @static
     * @property keyRepeatInterval
     * @type Number
     */
    static KEY_REPEAT_INTERVAL = 6;

    /**
     * A hash table to convert from a virtual key code to a mapped key name.
     *
     * @static
     * @property keyMapper
     * @type Object
     */
    static KEY_MAPPER = {
        9: 'tab',       // tab
        13: 'ok',       // enter
        16: 'shift',    // shift
        17: 'control',  // control
        18: 'control',  // alt
        27: 'escape',   // escape
        32: 'ok',       // space
        33: 'pageup',   // pageup
        34: 'pagedown', // pagedown
        37: 'left',     // left arrow
        38: 'up',       // up arrow
        39: 'right',    // right arrow
        40: 'down',     // down arrow
        45: 'escape',   // insert
        81: 'pageup',   // Q
        87: 'pagedown', // W
        88: 'escape',   // X
        90: 'ok',       // Z
        96: 'escape',   // numpad 0
        98: 'down',     // numpad 2
        100: 'left',    // numpad 4
        102: 'right',   // numpad 6
        104: 'up',      // numpad 8
        120: 'debug'    // F9
    };

    /**
     * A hash table to convert from a gamepad button to a mapped key name.
     *
     * @static
     * @property gamepadMapper
     * @type Object
     */
    static GAMEPAD_MAPPER = {
        0: 'ok',        // A
        1: 'cancel',    // B
        2: 'shift',     // X
        3: 'menu',      // Y
        4: 'pageup',    // LB
        5: 'pagedown',  // RB
        12: 'up',       // D-pad up
        13: 'down',     // D-pad down
        14: 'left',     // D-pad left
        15: 'right',    // D-pad right
    };

    /**
     * Clears all the input data.
     *
     * @static
     * @method clear
     */
    static clear() {
        this._currentState = {};
        this._previousState = {};
        this._gamepadStates = [];
        this._latestButton = null;
        this._pressedTime = 0;
        this._dir4 = 0;
        this._dir8 = 0;

        this._dirVictor = new Victor();

        this._preferredAxis = '';
        this._date = 0;
    };

    /**
     * Updates the input data.
     *
     * @static
     * @method update
     */
    static update() {
        this._pollGamepads();
        if (this._currentState[this._latestButton]) {
            this._pressedTime++;
        } else {
            this._latestButton = null;
        }
        for (let name in this._currentState) {
            if (this._currentState[name] && !this._previousState[name]) {
                this._latestButton = name;
                this._pressedTime = 0;
                this._date = Date.now();
            }
            this._previousState[name] = this._currentState[name];
        }
        this._updateDirection();
    };

    /**
     * Checks whether a key is currently pressed down.
     *
     * @static
     * @method isPressed
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is pressed
     */
    static isPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isPressed('escape')) {
            return true;
        } else {
            return !!this._currentState[keyName];
        }
    };

    /**
     * Checks whether a key is just pressed.
     *
     * @static
     * @method isTriggered
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is triggered
     */
    static isTriggered(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isTriggered('escape')) {
            return true;
        } else {
            return this._latestButton === keyName && this._pressedTime === 0;
        }
    };

    /**
     * Checks whether a key is just pressed or a key repeat occurred.
     *
     * @static
     * @method isRepeated
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is repeated
     */
    static isRepeated(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isRepeated('escape')) {
            return true;
        } else {
            return (this._latestButton === keyName &&
                (this._pressedTime === 0 ||
                    (this._pressedTime >= this.KEY_REPEAT_WAIT &&
                        this._pressedTime % this.KEY_REPEAT_INTERVAL === 0)));
        }
    };

    /**
     * Checks whether a key is kept depressed.
     *
     * @static
     * @method isLongPressed
     * @param {String} keyName The mapped name of the key
     * @return {Boolean} True if the key is long-pressed
     */
    static isLongPressed(keyName) {
        if (this._isEscapeCompatible(keyName) && this.isLongPressed('escape')) {
            return true;
        } else {
            return (this._latestButton === keyName &&
                this._pressedTime >= this.KEY_REPEAT_WAIT);
        }
    };


    /**
     * @static
     * @method _wrapNwjsAlert
     * @private
     */
    static _wrapNwjsAlert() {
        if (Utils.isNwjs()) {
            let _alert = window.alert;
            window.alert = function () {
                let gui = require('nw.gui');
                let win = gui.Window.get();
                _alert.apply(this, arguments);
                win.focus();
                Input.clear();
            };
        }
    };

    /**
     * @static
     * @method _setupEventHandlers
     * @private
     */
    static _setupEventHandlers() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
        document.addEventListener('keyup', this._onKeyUp.bind(this));
        window.addEventListener('blur', this._onLostFocus.bind(this));
    };

    /**
     * @static
     * @method _onKeyDown
     * @param {KeyboardEvent} event
     * @private
     */
    static _onKeyDown(event) {
        if (this._shouldPreventDefault(event.keyCode)) {
            event.preventDefault();
        }
        if (event.keyCode === 144) {    // Numlock
            this.clear();
        }
        let buttonName = this.KEY_MAPPER[event.keyCode];
        if (ResourceHandler.exists() && buttonName === 'ok') {
            ResourceHandler.retry();
        } else if (buttonName) {
            this._currentState[buttonName] = true;
        }
    };

    /**
     * @static
     * @method _shouldPreventDefault
     * @param {Number} keyCode
     * @private
     */
    static _shouldPreventDefault(keyCode) {
        switch (keyCode) {
            case 8:     // backspace
            case 33:    // pageup
            case 34:    // pagedown
            case 37:    // left arrow
            case 38:    // up arrow
            case 39:    // right arrow
            case 40:    // down arrow
                return true;
        }
        return false;
    };

    /**
     * @static
     * @method _onKeyUp
     * @param {KeyboardEvent} event
     * @private
     */
    static _onKeyUp(event) {
        let buttonName = this.KEY_MAPPER[event.keyCode];
        if (buttonName) {
            this._currentState[buttonName] = false;
        }
        if (event.keyCode === 0) {  // For QtWebEngine on OS X
            this.clear();
        }
    };

    /**
     * @static
     * @method _onLostFocus
     * @private
     */
    static _onLostFocus() {
        this.clear();
    };

    /**
     * @static
     * @method _pollGamepads
     * @private
     */
    static _pollGamepads() {
        if (navigator.getGamepads) {
            let gamepads = navigator.getGamepads();
            if (gamepads) {
                for (let i = 0; i < gamepads.length; i++) {
                    let gamepad = gamepads[i];
                    if (gamepad && gamepad.connected) {
                        this._updateGamepadState(gamepad);
                    }
                }
            }
        }
    };

    /**
     * @static
     * @method _updateGamepadState
     * @param {Gamepad} gamepad
     * @param {Number} index
     * @private
     */
    static _updateGamepadState(gamepad, index) {
        let lastState = this._gamepadStates[gamepad.index] || [];
        let newState = [];
        let buttons = gamepad.buttons;
        let axes = gamepad.axes;
        let threshold = 0.5;
        newState[12] = false;
        newState[13] = false;
        newState[14] = false;
        newState[15] = false;
        for (let i = 0; i < buttons.length; i++) {
            newState[i] = buttons[i].pressed;
        }
        if (axes[1] < -threshold) {
            newState[12] = true;    // up
        } else if (axes[1] > threshold) {
            newState[13] = true;    // down
        }
        if (axes[0] < -threshold) {
            newState[14] = true;    // left
        } else if (axes[0] > threshold) {
            newState[15] = true;    // right
        }
        for (let j = 0; j < newState.length; j++) {
            if (newState[j] !== lastState[j]) {
                let buttonName = this.GAMEPAD_MAPPER[j];
                if (buttonName) {
                    this._currentState[buttonName] = newState[j];
                }
            }
        }
        this._gamepadStates[gamepad.index] = newState;
    };

    /**
     * @static
     * @method _updateDirection
     * @private
     */
    static _updateDirection() {
        let x = this._signX();
        let y = this._signY();

        this._dir8 = this._makeNumpadDirection(x, y);
        this._updateVictorDirection(x, y);

        if (x !== 0 && y !== 0) {
            if (this._preferredAxis === 'x') {
                y = 0;
            } else {
                x = 0;
            }
        } else if (x !== 0) {
            this._preferredAxis = 'y';
        } else if (y !== 0) {
            this._preferredAxis = 'x';
        }

        this._dir4 = this._makeNumpadDirection(x, y);
    };

    /**
     * @static
     * @method _signX
     * @private
     */
    static _signX() {
        let x = 0;

        if (this.isPressed('left')) {
            x--;
        }
        if (this.isPressed('right')) {
            x++;
        }
        return x;
    };

    /**
     * @static
     * @method _signY
     * @private
     */
    static _signY() {
        let y = 0;

        if (this.isPressed('up')) {
            y--;
        }
        if (this.isPressed('down')) {
            y++;
        }
        return y;
    };

    /**
     * @static
     * @method _makeNumpadDirection
     * @param {Number} x
     * @param {Number} y
     * @return {Number}
     * @private
     */
    static _makeNumpadDirection(x, y) {
        if (x !== 0 || y !== 0) {
            return 5 - y * 3 + x;
        }
        return 0;
    };

    /**
     * @param x {Number} x
     * @param y {Number} y
     *
     * @private
     */
    static _updateVictorDirection(x, y) {
        this._dirVictor.x = x;
        this._dirVictor.y = y;
    }

    /**
     * @static
     * @method _isEscapeCompatible
     * @param {String} keyName
     * @return {Boolean}
     * @private
     */
    static _isEscapeCompatible(keyName) {
        return keyName === 'cancel' || keyName === 'menu';
    };
}

//-----------------------------------------------------------------------------
/**
 * The static class that handles input data from the mouse and touchscreen.
 *
 * @class TouchInput
 */
function TouchInput() {
    throw new Error('This is a static class');
}

/**
 * Initializes the touch system.
 *
 * @static
 * @method initialize
 */
TouchInput.initialize = function () {
    this.clear();
    this._setupEventHandlers();
};

/**
 * The wait time of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatWait
 * @type Number
 */
TouchInput.keyRepeatWait = 24;

/**
 * The interval of the pseudo key repeat in frames.
 *
 * @static
 * @property keyRepeatInterval
 * @type Number
 */
TouchInput.keyRepeatInterval = 6;

/**
 * Clears all the touch data.
 *
 * @static
 * @method clear
 */
TouchInput.clear = function () {
    this._mousePressed = false;
    this._screenPressed = false;
    this._pressedTime = 0;
    this._events = {};
    this._events.triggered = false;
    this._events.cancelled = false;
    this._events.moved = false;
    this._events.released = false;
    this._events.wheelX = 0;
    this._events.wheelY = 0;
    this._triggered = false;
    this._cancelled = false;
    this._moved = false;
    this._released = false;
    this._wheelX = 0;
    this._wheelY = 0;
    this._x = 0;
    this._y = 0;
    this._date = 0;
};

/**
 * Updates the touch data.
 *
 * @static
 * @method update
 */
TouchInput.update = function () {
    this._triggered = this._events.triggered;
    this._cancelled = this._events.cancelled;
    this._moved = this._events.moved;
    this._released = this._events.released;
    this._wheelX = this._events.wheelX;
    this._wheelY = this._events.wheelY;
    this._events.triggered = false;
    this._events.cancelled = false;
    this._events.moved = false;
    this._events.released = false;
    this._events.wheelX = 0;
    this._events.wheelY = 0;
    if (this.isPressed()) {
        this._pressedTime++;
    }
};

/**
 * Checks whether the mouse button or touchscreen is currently pressed down.
 *
 * @static
 * @method isPressed
 * @return {Boolean} True if the mouse button or touchscreen is pressed
 */
TouchInput.isPressed = function () {
    return this._mousePressed || this._screenPressed;
};

/**
 * Checks whether the left mouse button or touchscreen is just pressed.
 *
 * @static
 * @method isTriggered
 * @return {Boolean} True if the mouse button or touchscreen is triggered
 */
TouchInput.isTriggered = function () {
    return this._triggered;
};

/**
 * Checks whether the left mouse button or touchscreen is just pressed
 * or a pseudo key repeat occurred.
 *
 * @static
 * @method isRepeated
 * @return {Boolean} True if the mouse button or touchscreen is repeated
 */
TouchInput.isRepeated = function () {
    return (this.isPressed() &&
        (this._triggered ||
            (this._pressedTime >= this.keyRepeatWait &&
                this._pressedTime % this.keyRepeatInterval === 0)));
};

/**
 * Checks whether the left mouse button or touchscreen is kept depressed.
 *
 * @static
 * @method isLongPressed
 * @return {Boolean} True if the left mouse button or touchscreen is long-pressed
 */
TouchInput.isLongPressed = function () {
    return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
};

/**
 * Checks whether the right mouse button is just pressed.
 *
 * @static
 * @method isCancelled
 * @return {Boolean} True if the right mouse button is just pressed
 */
TouchInput.isCancelled = function () {
    return this._cancelled;
};

/**
 * Checks whether the mouse or a finger on the touchscreen is moved.
 *
 * @static
 * @method isMoved
 * @return {Boolean} True if the mouse or a finger on the touchscreen is moved
 */
TouchInput.isMoved = function () {
    return this._moved;
};

/**
 * Checks whether the left mouse button or touchscreen is released.
 *
 * @static
 * @method isReleased
 * @return {Boolean} True if the mouse button or touchscreen is released
 */
TouchInput.isReleased = function () {
    return this._released;
};

/**
 * [read-only] The horizontal scroll amount.
 *
 * @static
 * @property wheelX
 * @type Number
 */
Object.defineProperty(TouchInput, 'wheelX', {
    get: function () {
        return this._wheelX;
    },
    configurable: true
});

/**
 * [read-only] The vertical scroll amount.
 *
 * @static
 * @property wheelY
 * @type Number
 */
Object.defineProperty(TouchInput, 'wheelY', {
    get: function () {
        return this._wheelY;
    },
    configurable: true
});

/**
 * [read-only] The x coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property x
 * @type Number
 */
Object.defineProperty(TouchInput, 'x', {
    get: function () {
        return this._x;
    },
    configurable: true
});

/**
 * [read-only] The y coordinate on the canvas area of the latest touch event.
 *
 * @static
 * @property y
 * @type Number
 */
Object.defineProperty(TouchInput, 'y', {
    get: function () {
        return this._y;
    },
    configurable: true
});

/**
 * [read-only] The time of the last input in milliseconds.
 *
 * @static
 * @property date
 * @type Number
 */
Object.defineProperty(TouchInput, 'date', {
    get: function () {
        return this._date;
    },
    configurable: true
});

/**
 * @static
 * @method _setupEventHandlers
 * @private
 */
TouchInput._setupEventHandlers = function () {
    let isSupportPassive = Utils.isSupportPassiveEvent();
    document.addEventListener('mousedown', this._onMouseDown.bind(this));
    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    document.addEventListener('mouseup', this._onMouseUp.bind(this));
    document.addEventListener('wheel', this._onWheel.bind(this));
    document.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? {passive: false} : false);
    document.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? {passive: false} : false);
    document.addEventListener('touchend', this._onTouchEnd.bind(this));
    document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
    document.addEventListener('pointerdown', this._onPointerDown.bind(this));
};

/**
 * @static
 * @method _onMouseDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseDown = function (event) {
    if (event.button === 0) {
        this._onLeftButtonDown(event);
    } else if (event.button === 1) {
        this._onMiddleButtonDown(event);
    } else if (event.button === 2) {
        this._onRightButtonDown(event);
    }
};

/**
 * @static
 * @method _onLeftButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onLeftButtonDown = function (event) {
    let x = Graphics.pageToCanvasX(event.pageX);
    let y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._mousePressed = true;
        this._pressedTime = 0;
        this._onTrigger(x, y);
    }
};

/**
 * @static
 * @method _onMiddleButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMiddleButtonDown = function (event) {
};

/**
 * @static
 * @method _onRightButtonDown
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onRightButtonDown = function (event) {
    let x = Graphics.pageToCanvasX(event.pageX);
    let y = Graphics.pageToCanvasY(event.pageY);
    if (Graphics.isInsideCanvas(x, y)) {
        this._onCancel(x, y);
    }
};

/**
 * @static
 * @method _onMouseMove
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseMove = function (event) {
    if (this._mousePressed) {
        let x = Graphics.pageToCanvasX(event.pageX);
        let y = Graphics.pageToCanvasY(event.pageY);
        this._onMove(x, y);
    }
};

/**
 * @static
 * @method _onMouseUp
 * @param {MouseEvent} event
 * @private
 */
TouchInput._onMouseUp = function (event) {
    if (event.button === 0) {
        let x = Graphics.pageToCanvasX(event.pageX);
        let y = Graphics.pageToCanvasY(event.pageY);
        this._mousePressed = false;
        this._onRelease(x, y);
    }
};

/**
 * @static
 * @method _onWheel
 * @param {WheelEvent} event
 * @private
 */
TouchInput._onWheel = function (event) {
    this._events.wheelX += event.deltaX;
    this._events.wheelY += event.deltaY;
    event.preventDefault();
};

/**
 * @static
 * @method _onTouchStart
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchStart = function (event) {
    for (let i = 0; i < event.changedTouches.length; i++) {
        let touch = event.changedTouches[i];
        let x = Graphics.pageToCanvasX(touch.pageX);
        let y = Graphics.pageToCanvasY(touch.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            this._screenPressed = true;
            this._pressedTime = 0;
            if (event.touches.length >= 2) {
                this._onCancel(x, y);
            } else {
                this._onTrigger(x, y);
            }
            event.preventDefault();
        }
    }
    if (window.cordova || window.navigator.standalone) {
        event.preventDefault();
    }
};

/**
 * @static
 * @method _onTouchMove
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchMove = function (event) {
    for (let i = 0; i < event.changedTouches.length; i++) {
        let touch = event.changedTouches[i];
        let x = Graphics.pageToCanvasX(touch.pageX);
        let y = Graphics.pageToCanvasY(touch.pageY);
        this._onMove(x, y);
    }
};

/**
 * @static
 * @method _onTouchEnd
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchEnd = function (event) {
    for (let i = 0; i < event.changedTouches.length; i++) {
        let touch = event.changedTouches[i];
        let x = Graphics.pageToCanvasX(touch.pageX);
        let y = Graphics.pageToCanvasY(touch.pageY);
        this._screenPressed = false;
        this._onRelease(x, y);
    }
};

/**
 * @static
 * @method _onTouchCancel
 * @param {TouchEvent} event
 * @private
 */
TouchInput._onTouchCancel = function (event) {
    this._screenPressed = false;
};

/**
 * @static
 * @method _onPointerDown
 * @param {PointerEvent} event
 * @private
 */
TouchInput._onPointerDown = function (event) {
    if (event.pointerType === 'touch' && !event.isPrimary) {
        let x = Graphics.pageToCanvasX(event.pageX);
        let y = Graphics.pageToCanvasY(event.pageY);
        if (Graphics.isInsideCanvas(x, y)) {
            // For Microsoft Edge
            this._onCancel(x, y);
            event.preventDefault();
        }
    }
};

/**
 * @static
 * @method _onTrigger
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onTrigger = function (x, y) {
    this._events.triggered = true;
    this._x = x;
    this._y = y;
    this._date = Date.now();
};

/**
 * @static
 * @method _onCancel
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onCancel = function (x, y) {
    this._events.cancelled = true;
    this._x = x;
    this._y = y;
};

/**
 * @static
 * @method _onMove
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onMove = function (x, y) {
    this._events.moved = true;
    this._x = x;
    this._y = y;
};

/**
 * @static
 * @method _onRelease
 * @param {Number} x
 * @param {Number} y
 * @private
 */
TouchInput._onRelease = function (x, y) {
    this._events.released = true;
    this._x = x;
    this._y = y;
};