var assert = require('assert');
var mongoose = require('mongoose');
var restrictions = require('./restrictions.js');
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log('abrio la db')
	var restrictionSchema = mongoose.Schema({
		ip:{allowed:[String],denied:[String]},
		path:{allowed:[String],denied:[String]},
		times:Number,
		interval:Number
	});
	var Restriction = mongoose.model('Restriction', restrictionSchema);
	Restriction.find(function(err,elements){
		if(elements){
			Restriction.remove({}, function(err) { 
				console.log('collection removed') 
			}
		}	
		var restriction1=new Restriction();
		restriction1.ip.denied.push('200.42.23.2');
		restriction1.times=10;
		restriction1.save(function(err,element){
			if(err){
				console.log(err)
			}
			console.log(element);

		});
	});
			
});
	function convertToRestriction(restrict){
		var effectiveRestriction = new sestrictions.Restriction();
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
	function getRestrictions(collectionToReturn){

		Restriction.find(function(err,elements){
			if(elements){
				collectionToReturn=elements.map(convertToRestriction)
			}	
		}	
	}

	console.log(getRestrictions([]));