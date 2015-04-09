var http = require('http');
var https = require('https');
var url = require('url');

var server=http.createServer(function (browserRequest, browserResponse) {
var theHeaders=browserRequest.headers;
	delete theHeaders["host"];
  var options = {
  headers:theHeaders,
  host: 'api.mercadolibre.com',
  path: url.parse(browserRequest.url).path,
  method: browserRequest.method,
};
  if(options.path=='/favicon.ico'){
  	browserResponse.writeHead(200, {'Content-Type': 'text/plain'});
  	browserResponse.end('Error');
  	return
  }
  var apiRequest = https.request(options, function(apiResponse) { //el request http
  apiResponse.pipe(browserResponse);
  	browserResponse.writeHead(apiResponse.statusCode,apiResponse.headers);
  
  //console.log(request.url)
  //console.log(request.connection.remoteAddress) //ip que origina la conexion
  });
  browserRequest.pipe(apiRequest);
  apiRequest.end();
});
server.listen(8124);


console.log('Server running at http://127.0.0.1:8124/');
