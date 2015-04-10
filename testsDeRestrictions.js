var restrictions= require('./restrictions')
restrictions.forEach(function(element,index){
	console.log(element.deniesIp("200.42.23.2"));
});