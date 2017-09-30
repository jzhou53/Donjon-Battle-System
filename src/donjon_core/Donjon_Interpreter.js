/**
 * Interpreter class convert raw data stored in default RMMV data.json files
 * into Donjon data objects. For examples: Interpreter convert RMMV events into
 * XML structure that could be read by Donjon system.
 */``

class Donjon_Interpreter {

    /** @const @enum {string} */
    static CompStringMap = {
        transform: "Unity_Transform",
        rigidbody: "Rigidbody",
        circle_collider: "CircleCollider",
        box_collider: "BoxCollider"
    };

    /**
     * @param map_data {{events:[]}}
     * @param extractor {Donjon_Extractor}
     */
    constructor(map_data, extractor = new Default_Extractor) {
        /**
         * @type {{events: *[]}}
         * @private
         */
        this._dataMap = map_data;

        /**
         * @type {DOMParser}
         * @private
         */
        this._parser = null;

        /**
         * @type {Donjon_Extractor}
         * @private
         */
        this._extracter = extractor;

        /**
         * @type {Array.<Document>}
         * @private
         */
        this._documents = [];

        this._setupParser();
        this._checkDataJson(this._dataMap);

        this.createXMLObjects(this._dataMap);
        //temp
        this._documents.forEach(doc => {
            this.constructEntities(doc)
        }, this);

    }

    /**
     * @param xml {Document}
     * @return {JSON}
     */
    xmlToJson(xml) {
        let obj = {};
        if (xml.nodeType === 1) {
            if (xml.attributes.length > 0) {
                obj["ATTRIBUTES"] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj["ATTRIBUTES"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) {
            obj = xml.nodeValue;
        }
        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                let item = xml.childNodes.item(i);
                let nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === "undefined") {
                    obj[nodeName] = this.xmlToJson(item);
                } else {
                    if (typeof (obj[nodeName].push) === "undefined") {
                        let old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.xmlToJson(item));
                }
            }
        }
        return obj;
    };

    /**
     *
     * @param docXML {Document}
     * @return {Game_Object}
     */
    constructEntities(docXML) {
        /**
         * @type {{EVENT}}
         */
        let json = this.xmlToJson(docXML);
        /**
         * @type {{name,tag,x,y}}
         */
        let attributes = json.EVENT.ATTRIBUTES;

        let pages = json.EVENT.PAGE;
        pages = Array.isArray(pages) ? pages : [pages];

        pages.forEach(entity => {
            this._constructObject(entity, attributes);
        }, this);

        return null;
    }

    /**
     * @param entity
     * @param evnt_attributes{{name,tag,x,y}}
     * @return {Game_Object}
     * @private
     */
    _constructObject(entity, evnt_attributes) {
        /**
         * @type {{name,tag}}
         */
        let identity = entity.identity.ATTRIBUTES;
        let obj_name, obj_tag, obj_x, obj_y;
        obj_name = identity.name === 'auto' ? evnt_attributes.name : identity.name;
        obj_tag = identity.tag === 'auto' ? evnt_attributes.tag : identity.tag;

        /**
         * @type {{position,rotation,scale}}
         */
        let transform = entity.transform;
        obj_x = transform.position.ATTRIBUTES.x === 'auto' ? evnt_attributes.x : transform.position.ATTRIBUTES.x;
        obj_y = transform.position.ATTRIBUTES.y === 'auto' ? evnt_attributes.y : transform.position.ATTRIBUTES.y;


        //--------process to create obj------------------------
        let compParameters = [];

        let obj = new Game_Object(obj_name);
        obj.tag = obj_tag;
        obj.transform.position.x = obj_x;
        obj.transform.position.y = obj_y;

        let components = [];
        for (let element in entity) {
            if (entity.hasOwnProperty(element)) {
                components.push(element)
            }
        }
        components.splice(components.indexOf("#text"), 1);
        components.splice(components.indexOf("identity"), 1);
        components.splice(components.indexOf("transform"), 1);

        for (let i = 0; i < components.length; i++) {
            /* Bad Smell */
            //components[i] = eval("new " +
            // Donjon_Interpreter.CompStringMap[components[i]] + "(obj)")


            let a = new Unity_Transform();
            // obj.addComponent();
        }

        return obj;
    }

    /**
     * @param data {{events: *[]}}
     */
    createXMLObjects(data) {
        const rawEvnts = data.events;
        for (let i = 1; i < rawEvnts.length; i++) {
            if (rawEvnts[i] !== null) {
                let XMLString = this._extracter.extractString(rawEvnts[i]);
                let doc = this._parser.parseFromString(XMLString, "text/xml");
                this._documents.push(doc);
                console.log(doc);
            }
        }
    }

    /**
     * @private
     */
    _setupParser() {
        if (window.DOMParser) {
            this._parser = new DOMParser();
        } else if (window.ActiveXObject) {
            // dom = new ActiveXObject('Microsoft.XMLDOM');
            // dom.async = false;
            // dom.loadXML(xml);
        } else {
            throw new Error("Donjon_Interpreter:: Cannot parse XML string!");
        }

    }

    /**
     * check if data Game Map has events with event pages.
     * @param map_data {{events:[]}}
     * @return {boolean}
     */
    _checkDataJson(map_data) {
        if (map_data.events) {
            if (map_data.events.length < 2) {
                console.warn("Donjon_Interpreter:: No default game entities on map");
            }
            for (let i = 0; i < map_data.events.length; i++)
                if (map_data.events[i] && !map_data.events[i].pages) {
                    throw new Error("Donjon_Interpreter:: Map data incorrect.");
                }
        } else {
            throw new Error("Donjon_Interpreter:: Map data incorrect.");
        }
        return true;
    }
}

/**
 * @abstract
 */
class Donjon_Extractor {

    static CODES = {
        SCRIPT_BEGIN: 355,
        SCRIPT: 655,
        COMMENT_BEGIN: 108,
        COMMENT: 408,
        END_OF_PAGE: 0
    };

    constructor() {
    }

    /**
     * @abstract
     * @param event {{pages:Array}}
     * @return {String}
     */
    extractString(event) {
    }

    /**
     * @abstract
     * @param eventPage {{list:Array}}
     * @return {string}
     * @private
     */
    _extractOnePage(eventPage) {
    }

    /**
     * @abstract
     * @param event {{id,name,note,x,y}}
     * @return {String}
     * @protected
     */
    _extractEventIdentity(event) {
    }

    /**
     * @abstract
     * @param cmd {{code:number,parameters:Array}}
     * @return {String}
     * @protected
     */
    _extractOneLine(cmd) {
    }

}

/**
 * @extends Donjon_Extractor
 */
class Default_Extractor extends Donjon_Extractor {

    constructor() {
        super();
    }

    extractString(event) {
        let str = "<EVENT ";
        str += this._extractEventIdentity(event);
        str += " >\n";
        //note the array start with null
        for (let index = 0; index < event.pages.length; index++) {
            str += this._extractOnePage(event.pages[index]);
        }
        str += "</EVENT>";
        // console.log(str);
        return str;
    }

    _extractOnePage(eventPage) {
        let str = "<PAGE>\n";
        const list = eventPage.list;
        for (let i = 0; i < list.length; i++) {
            str += this._extractOneLine(list[i]);
        }
        str += "</PAGE>";
        return str + '\n';
    }

    _extractEventIdentity(event) {
        let name = event.name || "unnamed",
            tag = event.note || "untagged",
            x = event.x || "0",
            y = event.y || "0";
        return "name = \"" + name + "\" tag = \"" + tag + "\" x = \"" + x + "\" y = \"" + y + "\"";
    }

    _extractOneLine(cmd) {
        let str = '';
        //collecting string`
        if (cmd.code === Donjon_Extractor.CODES.SCRIPT_BEGIN ||
            cmd.code === Donjon_Extractor.CODES.SCRIPT ||
            cmd.code === Donjon_Extractor.CODES.COMMENT_BEGIN ||
            cmd.code === Donjon_Extractor.CODES.COMMENT) {
            str += cmd.parameters[0] + '\n';
        }
        return str;
    }
}

