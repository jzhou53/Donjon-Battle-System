Victor = require('./dist/js/libs/victor');

var vec = new Victor(1, 0);

vec.rotate(Math.PI / 3);
console.log(vec.toString());
vec.rotate(Math.PI / 2);
console.log(vec.toString());


// vic.rotateByDeg(30);
// console.log(vic.toString());
// vic.rotateByDeg(30);
// console.log(vic.toString());
