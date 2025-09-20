const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

//Respond with status code
const respond = (request, response, content, type, status = 200) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

//Respond with JSON
const respondJSON = (request, response, status, object) => {
  const content = JSON.stringify(object);
  respond(request, response, content, 'application/json', status);
};

//Respond with XML
const respondXML = (request, response, status, object) => {
  //Create string
  let content = '<response>';

  //Add message and ID if it exists
  content += `<message>${object.message}</message>`;
  if (object.id) {
    content += `<id>${object.id}</id>`;
  }
  content += '</response>';

  respond(request, response, content, 'text/xml', status);
};

//Unified response function that detects format automatically
const respondWithFormat = (request, response, status, responseData) => {
  const acceptHeader = request.headers.accept || 'application/json';
  const useXML = acceptHeader.includes('text/xml');

  if (useXML) {
    respondXML(request, response, status, responseData);
  } else {
    respondJSON(request, response, status, responseData);
  }
};

//Index of page
const getIndex = (request, response) => {
  respond(request, response, index, 'text/html');
};

//CSS file
const getCSS = (request, response) => {
  respond(request, response, css, 'text/css');
};

//Success response
const success = (request, response) => {
  const responseData = {
    message: 'This is a successful response',
  };

  respondWithFormat(request, response, 200, responseData);
};

//Bad Request response
const badRequest = (request, response, params) => {
  //Default response
  const responseData = {
    message: 'This request has the required parameters',
  };

  //If parameter is missing or false, send with error code
  if (params?.query?.valid !== 'true') {
    const acceptHeader = request.headers.accept || 'application/json';
    const useXML = acceptHeader.includes('text/xml');

    responseData.message = 'Missing valid query parameter set to true';
    responseData.id = 'badRequest';

    return respondWithFormat(request, response, 400, responseData);
  }

  //If parameter exists, send with success code
  return respondWithFormat(request, response, 200, responseData);
};

//Unauthorized response
const unauthorized = (request, response, params) => {
  //Default response
  const responseData = {
    message: 'You have successfully viewed the content.',
  };

  //If parameter is missing or false, send with 401 code
  if (params?.query?.loggedIn !== 'yes') {
    //New message and ID
    responseData.message = 'Missing loggedIn query parameter set to yes';
    responseData.id = 'unauthorized';

    return respondWithFormat(request, response, 401, responseData);
  }

  //If parameter exists, send with success code
  return respondWithFormat(request, response, 200, responseData);
};

//Forbidden response
const forbidden = (request, response) => {
  const responseData = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respondWithFormat(request, response, 403, responseData);
};

//Internal Server Error response
const internal = (request, response) => {
  const responseData = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  respondWithFormat(request, response, 500, responseData);
};

//Not Implemented response
const notImplemented = (request, response) => {
  const responseData = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  respondWithFormat(request, response, 501, responseData);
};

//Not Found response
const anythingElse = (request, response) => {
  const responseData = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondWithFormat(request, response, 404, responseData);
};

//Export
module.exports = {
  getIndex,
  getCSS,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  anythingElse,
};
