/*****************************************
 * 
 * RESTful JSON API 
 * that returns a welcome message 
 * 
 ****************************************/
var config = require('./config')
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var httpServer = http.createServer(function(request, response) {
    
    // Get the URL and parse it
    var parsedURL = url.parse(request.url, true);
    
    // Get the path
    var path = parsedURL.pathname;
    var trimmedPath = path.replace(/^\/+|\/$/g, '');
    
    // Get the query string as an object
    var queryStringObject = parsedURL.query;
    
    // Get the http method
    var method = request.method.toLocaleLowerCase();
    
    // Get the headers as an object
    var headers = request.headers;
    
    // Get the payload if any
    var decoder = new StringDecoder('utf-8');    
    var buffer = '';
    
    request.on('data', function(data) {
        buffer += decoder.write(data);
    });

    // Construct the data object to send the handler
    var data = {
        'trimmedPath': trimmedPath,
        'queryStringObject': queryStringObject,
        'method': method,
        'headers': headers,
        'payload': buffer
    };
    
    request.on('end', function(data) {
       
        // Choose the handler the requst should go to.
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
        
        // Route the request to the handler specified in the router
        chosenHandler(data, function(statusCode, payload) {
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
            
            // Use the payload called back by the handler, or default to empty
            payload = typeof(payload) == 'object' ? payload : {};
            
            var payloadString = JSON.stringify(payload);
            
            // Return the resonse
            response.setHeader('Content-Type', 'application/json');
            response.writeHead(statusCode);
            response.end(payloadString);
            
            // Log the request
            if (statusCode === 404) {
                console.error("Returning response", 404, payloadString);
            }
            else if (statusCode === 200) {
                console.log("Returning response", 200, payloadString);
            }
            else {
                console.error("Something went wrong!!!");
            }
        });
    });
});

// Start the http server
httpServer.listen(config.httpPort, function() {
   console.log("The server is listening on port", config.httpPort);
});

// Define handlers
var handlers = {}

// Not found handler
handlers.notFound = function(data, callback) {
    var statusCode = 404;
    var message = 'The page was not found!';
    
    callback(statusCode, {'error': message});
}

// Hello handler
handlers.hello = function(data, callback) {
    var statusCode = 200;
    var greeting = 'Hello, World! Welcome to the JSON RESTful API';
    
    callback(statusCode, {'greeting': greeting});
}

// Define a request router
var router = {
    'hello': handlers.hello
}