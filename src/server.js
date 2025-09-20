const http = require('http');
const responseHandler = require('./responses.js');

// Set port
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// URLS
const urlStruct = {
  '/': responseHandler.getIndex,
  '/success': responseHandler.success,
  '/badRequest': responseHandler.badRequest,
  '/unauthorized': responseHandler.unauthorized,
  '/forbidden': responseHandler.forbidden,
  '/internal': responseHandler.internal,
  '/notImplemented': responseHandler.notImplemented,
  '/style.css': responseHandler.getCSS,
};

const onRequest = (request, response) => {
  // Parse URL
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  const params = {
    query: Object.fromEntries(parsedUrl.searchParams),
  };

  // Check if URL exists
  if (urlStruct[parsedUrl.pathname]) {
    // Call response handler (handles both JSON and XML internally)
    urlStruct[parsedUrl.pathname](request, response, params);
  } else {
    // URL does not exist - call not found handler
    responseHandler.anythingElse(request, response, params);
  }
};

// Create server
http.createServer(onRequest).listen(port);
console.log(`Listening on 127.0.0.1: ${port}`);
