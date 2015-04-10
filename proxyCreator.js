var http = require('http');
var https = require('https');
var url = require('url');
var serverPort;
var redis = require('redis');
var client = redis.createClient();
var restrictions= require('./restrictions');
client.on('connect',function(){
	console.log('se conecto a la base de datos')
});
client.on('error',function(){
	console.log('hubo un error con la base de datos')
});
var restrictions = require('./restrictions.js');
var createProxy=function(configurations){

	var server=http.createServer(function (browserRequest, browserResponse) {
		var theHeaders=browserRequest.headers;
		delete theHeaders["host"];
		serverPort=configurations ? configurations.serverPort : 8124
		var options = {
			headers:theHeaders,
			host: configurations ? configurations.host : 'api.mercadolibre.com',
  			port: configurations ? configurations.destinationHost : 443, //443 es el default de https
  			path: url.parse(browserRequest.url).path,
  			method: browserRequest.method,
		};

		if(options.path=='/favicon.ico'){
			browserResponse.writeHead(200, {'Content-Type': 'text/plain'});
			browserResponse.end('Error');
			return
		}		checkPossibleConnection(browserRequest,browserResponse,options);

	});
	server.listen(serverPort || 8124);
	function checkPossibleConnection(request,response,options){																		//cant params,lugar a incrementar,tiempo de expiracion
		var isAccepted=true;
		var deniers=restrictions.filter(function(restriction){

			isAccepted=isAccepted&&!(restriction.deniesRequest(request)&&(restriction.times==0));
			return restriction.deniesRequest(request);
		});
		console.log(isAccepted)
		if(isAccepted){

			
		deniers.forEach(function(restriction,index){
			
			client.eval('if redis.call("incr",KEYS[1])==1 then \n redis.call("expire",KEYS[1],KEYS[2]) \n  end  \n return redis.call("get",KEYS[1]) ',2,restriction.generateRegister(),restriction.interval+1,function(err,reply){
			//evalua si es la primera vez q se incerta esa key incrementandola, si es 1 (era 0 antes), le avisa que la expire
			//TODO que corresponda la key a lo que tiene que ser
			if(!err){
				console.log(reply)
				console.log(restriction.times)
				if(isAccepted&&reply>restriction.times ){
					isAccepted=false;
					console.log("rejected");
					sendForbidden(response);
				}else{
					
				}
				//codigo correspondiente a un guardado exitoso
				//console.log(reply)
			}else{
				//codigo correspondiente a un guardado erroneo
				console.log(err)
			}
			
		});

	});
	}else{
		sendForbidden(response);
	}
	
	}
	function makeRequest(browserRequest,browserResponse,options){

  		var apiRequest = https.request(options, function(apiResponse) { //el request http
  		apiResponse.pipe(browserResponse); //fuerzo a que todo lo que se recibe de la api vaya al browser
  		browserResponse.writeHead(apiResponse.statusCode,apiResponse.headers); //se asegura que le lleguen los headers al browser

  		//console.log(request.url)
  		//console.log(request.connection.remoteAddress) //ip que origina la conexion
	});
  	browserRequest.pipe(apiRequest); //manda los elementos de un put/post del browser a la api
  	apiRequest.end();	
	}
	function sendForbidden(response){ //no le permite el acceso al usuario
		console.log('forbidden');
		response.writeHead(403,{'Content-Type':'text/plain'});
		response.end('forbidden');
	}

	console.log('Server running at http://127.0.0.1:8124/');
	};
	module.exports=createProxy;