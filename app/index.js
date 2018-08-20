/*****************************************
 * 
 * RESTful JSON API 
 * that returns a welcome message 
 * 
 ****************************************/
var http = require('http');
var config = require('./config')

var httpServer = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello, World\n');
});

// Start the http server
httpServer.listen(config.httpPort, function() {
   console.log("The server is listening on port", config.httpPort);
});