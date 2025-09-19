const respondJSON = (request, response, status, object) => {
    const content = JSON.stringify(object);
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    response.write(content);
    response.end();
};

const success = (request, response) => {
    const responseJSON = {
        message: 'This is a successful response',
    };

    //Send JSON with success code
    respondJSON(request, response, 200, responseJSON);
};

const badRequest = (request, response, params) => {
    //Default json response
    const responseJSON = {
        message: 'This request has the required parameters',
    };

    //If parameter is missing or false, send json with error code
    if (!params || !params.query || !params.query.valid || params.query.valid !== 'true') {
        responseJSON.message = 'Missing valid query parameter set to yes';
        responseJSON.id = 'badRequest';
        return respondJSON(request, response, 400, responseJSON);
    }

    //If parameter exists, send json with success code
    return respondJSON(request, response, 200, responseJSON);
};

const unauthorized = (request, response, params) => {
    //Default JSON response
    const responseJSON = {
        message: 'You have successfully viewed the content.',
    };

    //If parameter is missing or false, send json with 401 code
    if (!params || !params.query || !params.query.loggedIn || params.query.loggedIn !== 'yes') {
        
        //New message and ID
        responseJSON.message = 'Missing loggedIn query parameter set to yes';
        responseJSON.id = 'unauthorized';
        return respondJSON(request, response, 401, responseJSON);
    }

    //If parameter exists, send json with success code
    return respondJSON(request, response, 200, responseJSON);
};

const forbidden = (request, response) => {
    const responseJSON = {
        message: 'You do not have access to this content.',
        id: 'forbidden',
    };

    //Send JSON with error code
    respondJSON(request, response, 403, responseJSON);
};

const internal = (request, response) => {
    const responseJSON = {
        message: 'Internal Server Error. Something went wrong.',
        id: 'internalError',
    };

    //Send JSON with error code
    respondJSON(request, response, 500, responseJSON);
};

const notImplemented = (request, response) => {
    const responseJSON = {
        message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
        id: 'notImplemented',
    };

    //Send JSON with error code
    respondJSON(request, response, 501, responseJSON);
};

const anythingElse = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    //Send JSON with error code
    respondJSON(request, response, 404, responseJSON);
};

module.exports = {
    success,
    badRequest,
    unauthorized,
    forbidden,
    internal,
    notImplemented,
    anythingElse,
};
