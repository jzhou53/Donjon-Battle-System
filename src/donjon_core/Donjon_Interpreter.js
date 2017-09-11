/**
 * Interpreter class convert raw data stored in default RMMV data.json files into
 * Donjon data objects.
 * For examples: Interpreter convert RMMV events into XML structure that could be read by
 * Donjon system.
 */
class Donjon_Interpreter {

    static CODES = {
        SCRIPT_BEGIN: 355,
        SCRIPT: 655,
        COMMENT_BEGIN: 108,
        COMMENT: 408,
        END_OF_PAGE: 0
    };

    /**
     * @param map_data {{events:[]}}
     */
    constructor(map_data) {
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
         * @type {Array.<Document>}
         * @private
         */
        this._documents = [];

        this._setupParser();
        this._checkDataJson(this._dataMap);

        this.createXMLObjects(this._dataMap);

    }

    /**
     * @param data {{events: *[]}}
     */
    createXMLObjects(data) {
        const rawEvnts = data.events;
        for (let i = 1; i < rawEvnts.length; i++) {
            if (rawEvnts[i] !== null) {
                let XMLString = this.extractXMLString(rawEvnts[i]);
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
     * @param event {{pages:Array}}
     * @return {String}
     */
    extractXMLString(event) {
        let str = "<Entity ";
        str += this._extractIdentity(event);
        str += " >";
        //note the array start with null
        for (let index = 1; index < event.pages.length; index++) {
            str += this._extractOnePage(event.pages[index]);
        }
        str += "</Entity>";
        //console.log(str);
        return str;
    }

    /**
     * @param eventPage {{list:Array}}
     * @return {string}
     * @private
     */
    _extractOnePage(eventPage) {
        let str = "<page>\n";
        const list = eventPage.list;
        for (let i = 0; i < list.length; i++) {
            str += this._extractOneLine(list[i]);
        }
        str += "</page>";
        return str + '\n';
    }

    /**
     * @param event {{id,name,note,x,y}}
     * @return {String}
     * @private
     */
    _extractIdentity(event) {
        let name = event.name || "unnamed",
            tag = event.name || "untagged",
            x = event.x || "0",
            y = event.y || "0";
        return "name = \"" + name + "\" tag = \"" + tag + "\" x = \"" + x + "\" y = \"" + y + "\"";
        //return "<event_data name = \"" + name + "\" tag = \"" + tag + "\" x = \"" + x + "\" y = \"" + y + "\"/>\n";
    }

    /**
     * @param cmd {{code:number,parameters:Array}}
     * @return {String}
     * @private
     */
    _extractOneLine(cmd) {
        let str = '';
        //collecting string`
        if (cmd.code === Donjon_Interpreter.CODES.SCRIPT_BEGIN ||
            cmd.code === Donjon_Interpreter.CODES.SCRIPT ||
            cmd.code === Donjon_Interpreter.CODES.COMMENT_BEGIN ||
            cmd.code === Donjon_Interpreter.CODES.COMMENT) {
            str += cmd.parameters[0] + '\n';
        }
        return str;
    }

    /**
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