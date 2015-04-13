var http = require('http');
var https = require('https');
var url = require('url');
var serverPort;
var redis = require('redis');
var client = redis.createClient(6379,'uriel.mzzdk2.0001.usw2.cache.amazonaws.com');
var restrictions= require('./restrictions');
client.on('connect',function(){
	console.log('conectando a la base de datos');
});
client.on('ready',function(){
	console.log('db lista para transmitir');
});
client.on('error',function(error){
	console.log(error);
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
			console.log(restriction.generateRegister());
			isAccepted=isAccepted&&!(restriction.deniesRequest(request)&&(restriction.times==0));
			return restriction.deniesRequest(request);
		});
		console.log(isAccepted)
		var possible=deniers.length;
		console.log(possible);
		if(isAccepted){
			if(possible>0){	
			
		deniers.forEach(function(restriction,index){
			console.log("haciendo request para "+ restriction.generateRegister);			
			client.eval('if redis.call("incr",KEYS[1])==1 then \n redis.call("expire",KEYS[1],KEYS[2]) \n  end  \n return redis.call("get",KEYS[1]) ',2,restriction.generateRegister(),restriction.interval+1,function(err,reply){
			//evalua si es la primera vez q se incerta esa key incrementandola, si es 1 (era 0 antes), le avisa que la expire
			
			if(!err){
				console.log(reply + " devolvio")
				console.log(restriction.times + " restricciones")
				if(isAccepted&&reply>restriction.times ){
					isAccepted=false;
					console.log("rejected");
					sendForbidden(response);
				}else{
					possible--;
					console.log('quedan ' +possible)
					if(possible==0){
						console.log("making request")
						makeRequest(request,response,options);
					}
				}
				//codigo correspondiente a un guardado exitoso
				////console.log(reply)
			}else{
				//codigo correspondiente a un guardado erroneo
				console.log(err)
			}
			
		});

	});
		}else{
			makeRequest(request,response,options);
		}
	}else{
		sendForbidden(response);
	}
	
	}
	function makeRequest(browserRequest,browserResponse,options){

  		var apiRequest = https.request(options, function(apiResponse) { //el request http
  		apiResponse.pipe(browserResponse); //fuerzo a que todo lo que se recibe de la api vaya al browser
  		browserResponse.writeHead(apiResponse.statusCode,apiResponse.headers); //se asegura que le lleguen los headers al browser

  		////console.log(request.url)
  		////console.log(request.connection.remoteAddress) //ip que origina la conexion
	});
  	browserRequest.pipe(apiRequest); //manda los elementos de un put/post del browser a la api
  	apiRequest.end();	
	}
	function sendForbidden(response){ //no le permite el acceso al usuario
		//console.log('forbidden \n');
		response.writeHead(403,{'Content-Type':'text/plain'});
		response.end('forbidden');
	}

	console.log('Server running at http://127.0.0.1:8124/');
	};
	module.exports=createProxy;
