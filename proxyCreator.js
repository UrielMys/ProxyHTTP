var http = require('http');
var https = require('https');
var url = require('url');
var serverPort;
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
  }
  var apiRequest = https.request(options, function(apiResponse) { //el request http
  apiResponse.pipe(browserResponse); //fuerzo a que todo lo que se recibe de la api vaya al browser
  	browserResponse.writeHead(apiResponse.statusCode,apiResponse.headers); //se asegura que le lleguen los headers al browser
  
  //console.log(request.url)
  //console.log(request.connection.remoteAddress) //ip que origina la conexion
  });
  browserRequest.pipe(apiRequest); //manda los elementos de un put/post del browser a la api
  apiRequest.end();
});
server.listen(serverPort || 8124);


console.log('Server running at http://127.0.0.1:8124/');
};
module.exports=createProxy;