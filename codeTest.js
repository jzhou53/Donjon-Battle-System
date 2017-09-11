function ABC() {
    this.initialize.apply(this, arguments);
}

ABC.prototype.initialize = function (num) {
    this._string = "66666666666666666" + num;
};

ABC.prototype.toString = function () {
    return this._string;
};

var obj = {};
var a = new ABC();
console.log(obj + ", " + a.toString());


obj["Object1"] = new ABC(1);
obj["Object2"] = new ABC(2);
console.log(obj);
console.log(Object.getOwnPropertyNames(obj));

for (var property in obj) {
    console.log(property.toString());
}

//
// obj[item] = new item();