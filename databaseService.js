module.exports.refreshRestrictions=function(){
	console.log("database is being initialized, please wait");
}; //inicializaciones
module.exports.getRestrictions=[];	

var currentRestrictions=[];
var mongoose = require('mongoose');
var restrictions = require('./restrictions.js');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var restrictionSchema = mongoose.Schema({
	ip:{allowed:[String],denied:[String]},
	path:{allowed:[String],denied:[String]},
	times:Number,
	interval:Number
});
var Restriction = mongoose.model('Restriction', restrictionSchema);
db.once('open', function (callback) {
	module.exports.refreshRestrictions=refreshRestrictions;
	module.exports.getRestrictions=currentRestrictions;	
});
function refreshRestrictions(){
	Restriction.find(function(err,elements){
		//console.log(elements)
		if(elements){
			currentRestrictions=elements.map(convertToRestriction);
			//console.log("traidos los elementos")
		}	
	module.exports.getRestrictions=currentRestrictions;			

	});	
};
function convertToRestriction(restrict){
	var effectiveRestriction = new restrictions.Restriction();
	restrict.ip.allowed.forEach(function(element,index){
		effectiveRestriction.allowIP(new RegExp(element));
	});
	restrict.ip.denied.forEach(function(element,index){
		effectiveRestriction.denyIP(new RegExp(element));
	});
	restrict.path.allowed.forEach(function(element,index){
		effectiveRestriction.allowPath(new RegExp(element));
	});
	restrict.path.denied.forEach(function(element,index){
		effectiveRestriction.denyPath(new RegExp(element));
	});
	effectiveRestriction.times=restrict.times || 0;
	effectiveRestriction.interval=restrict.interval||1;
	return effectiveRestriction;
}
