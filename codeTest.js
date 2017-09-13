function ABC() {
    this.initialize.apply(this, arguments);
}

ABC.prototype.initialize = function (num) {
    this._string = "66666666666666666" + num;
};

ABC.prototype.addOne = function (a,b,c) {
  this._string += "-";
};

ABC.prototype.toString = function () {
    return this._string;
};


obj = {};
obj[ABC.name] = new ABC();

console.log(obj[ABC.name]);
