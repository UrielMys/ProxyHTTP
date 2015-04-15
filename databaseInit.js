var assert = require('assert');
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
	console.log('abrio la db')
	Restriction.find(function(err,elements){
		if(elements){
			Restriction.remove({}, function(err) { 
				console.log('collection removed') 
			}	);
		}
		var restriction1=new Restriction();
		restriction1.ip.denied.push('200.42.23.2');
		restriction1.times=10;
		restriction1.save(function(err,element){
			if(err){
				console.log(err)
			}
			//console.log("saved element " +element);

		});

		var restriction2=new Restriction();
		restriction2.path.denied.push('^\/sites/MLA*');
		restriction2.times=2;
		restriction2.interval=10;
		restriction2.save(function(err,element){
			if(err){
				console.log(err)
			}
			//console.log("saved element " +element);

		});
		var restriction3=new Restriction();
		restriction3.ip.denied.push('200.42.23.2');
		restriction3.path.denied.push('^\/sites*$');
		restriction3.times=10;
		restriction3.save(function(err,element){
			if(err){
				console.log(err)
			}
			//console.log("saved element " +element);

		});
		var restriction4=new Restriction();
		restriction4.ip.denied.push('127\..*');
		restriction4.times=10;
		restriction4.save(function(err,element){
			if(err){
				console.log(err)
			}
			process.exit(0);
			//console.log("saved element " +element);

		});
	});

});