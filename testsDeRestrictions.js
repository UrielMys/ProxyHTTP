var restrictions= require('./restrictions')
restrictions.forEach(function(element,index){
	console.log(element.deniesIpOrPath("200.42.23.2",""));
	console.log(element.deniesIpOrPath("","/sites/hello"))
	console.log(element.generateRegister());
});