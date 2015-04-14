var assert = require('assert');
var restrict= require('./restrictions');
var rules=restrict.getRules;
var restrictions=restrict.restrictions;

console.log("restrictions");
assert(restrictions[0].match("200.42.23.2",""));
assert(!restrictions[0].match("","/sites/hello"));
assert(restrictions[0].match("200.42.23.2","/sites/hello"));
assert(!restrictions[1].match("200.42.23.2",""));
assert(restrictions[1].match("","/sites/hello"));
assert(restrictions[1].match("200.42.23.2","/sites/hello"));
assert(!restrictions[2].match("200.42.23.2",""));
assert(!restrictions[2].match("","/sites/hello"));
assert(restrictions[2].match("200.42.23.2","/sites/hello"));
console.log("all restrictions test passed");
console.log("rules");
assert(rules[0].matchesRestriction('200.42.23.2'));
assert(!rules[0].matchesRestriction("/sites/hello"));
assert(!rules[1].matchesRestriction('200.42.23.2'));
assert(rules[1].matchesRestriction("/sites/hello"));
console.log("all rules test passed");
restrictions.forEach(function(element){
	console.log(element.generateRegister())
})