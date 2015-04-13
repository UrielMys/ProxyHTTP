var restrictions= require('./restrictions')
restrictions.forEach(function(element,index){
	console.log(element.deniesIpAndPath("200.42.23.2",""));
	console.log(element.deniesIpAndPath("","/sites/hello"))
	console.log(element.generateRegister());
});
