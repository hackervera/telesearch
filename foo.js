var bar = require("./bar.js");
var first = new bar.cool;
var second = new bar.cool;


first.printa();
first.bizzle();
first.printa();
second.printa();

var blah = {}
blah.a = "yo"

var Bley = function(){}

Bley.prototype = blah
Bley.prototype.poop = "yummy"

var bley = new Bley
console.log(bley.a);
console.log(bley.poop);
