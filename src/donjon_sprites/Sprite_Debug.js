class Debug_Layer extends PIXI.Container {
    constructor() {
        super();
        this._width = Graphics.width;
        this._height = Graphics.height;
        this._sprites = [];

        this._createBitmaps();

        /**
         * ['default'].
         *
         * @property type
         * @type {string}
         */
        this.type = 'default';

        /**
         * @property origin
         * @type Point
         */
        this.origin = new Point();

    }

    _createBitmaps() {
        // this._rainBitmap = new Bitmap(1, 60);

    }

    update() {
        super.update();

    }


}