var http = require('http');
var https = require('https');
var url = require('url');

var server=http.createServer(function (browserRequest, browserResponse) {
  console.log(browserRequest.headers)
  var options = {
  host: 'api.mercadolibre.com',
  path: url.parse(browserRequest.url).path,
  method: browserRequest.method
};
  if(options.path=='/favicon.ico'){
  	browserResponse.writeHead(200, {'Content-Type': 'text/plain'});
  	browserResponse.end('Error');
  	return
  }
  var apiRequest = https.request(options, function(apiResponse) { //el request http
  
  apiResponse.on('error',function(e){
   console.log( e.stack );
  });
  var textoApi=""; //el que va al browser
  apiResponse.on('data',function(datos){ //cosas de la api al browser
  	textoApi+=datos;
  });
  apiResponse.on('end',function(){ //cierro la conxion con la api
  	browserResponse.writeHead(200, {'Content-Type': 'application/json'}); 
  	browserResponse.end(textoApi);//cierro la conexion con el browser
  });
});
  var textoBrowser=""; //el que va a la api
  browserRequest.on('data',function(datos){
  	textoBrowser+=datos
  })
  browserRequest.on('end',function(){
  	apiRequest.write(textoBrowser);
  	apiRequest.end();	
  })
  //console.log(request.url)
  //console.log(request.connection.remoteAddress) //ip que origina la conexion
  
});
server.listen(8124);


console.log('Server running at http://127.0.0.1:8124/');
