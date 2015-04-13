var restrictions= require('./restrictions')
restrictions.forEach(function(element,index){
	 console.log(element.generateRegister());
	console.log(element.match("200.42.23.2",""));
	console.log(element.match("","/sites/hello"));
});
