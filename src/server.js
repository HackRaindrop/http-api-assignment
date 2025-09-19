const http = require('http');
const responseHandler = require('./responses.js');
const JSONResponseHandler = require('./jsonResponses.js');
const XMLResponseHandler = require('./xmlResponses.js');

//Set port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//URLS
const urlStruct = {
    '/': responseHandler.getIndex,
    '/success': JSONResponseHandler.success,
    '/badRequest': JSONResponseHandler.badRequest,
    '/unauthorized': JSONResponseHandler.unauthorized,
    '/forbidden': JSONResponseHandler.forbidden,
    '/internal': JSONResponseHandler.internal,
    '/notImplemented': JSONResponseHandler.notImplemented,
    '/style.css': responseHandler.getCSS,
};


const onRequest = (request, response) => {

    //Parse URL
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
    const params = {
        query: Object.fromEntries(parsedUrl.searchParams)
    }

    //Check accept header
    //Default to JSON
    const acceptHeader = request.headers.accept || 'application/json';
    const useXML = acceptHeader.includes('text/xml');

    //Check if URL exists
    if (urlStruct[parsedUrl.pathname]) {

        //Check if XML is requested
        if (useXML && XMLResponseHandler[parsedUrl.pathname.slice(1)]) {

            //Call XML response handler
            XMLResponseHandler[parsedUrl.pathname.slice(1)](request, response, params);
        } else {

            //Call JSON response handler
            urlStruct[parsedUrl.pathname](request, response, params);
        }

        //URL does not exist
    } else {
        if (useXML) {

            //Call XML response handler
            XMLResponseHandler.anythingElse(request, response, params);
        } else {

            //Call JSON response handler
            JSONResponseHandler.anythingElse(request, response, params);
        }
    }
};

//Create server
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);