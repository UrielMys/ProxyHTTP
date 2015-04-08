var http = require('http');
var https = require('https')

var server=http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  response.end('Hello World\n');
  var data = '';
  var options = {
  host: 'www.api.mercadolibre.com',
  port: 80,
  method: 'GET'
};
  options.path=request.url
  console.log(options)
  var req = https.get(options, function(res) {
  console.log("volvio")
});
  console.log(request.url)
  console.log(request.connection.remoteAddress) //ip que origina la conexion

});
server.listen(8124);


console.log('Server running at http://127.0.0.1:8124/');

exports.world = function() {
  console.log('Hello World');
}