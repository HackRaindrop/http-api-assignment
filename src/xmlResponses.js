
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

    //Send response
    response.writeHead(status, {
        'Content-Type': 'text/xml',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });
    response.write(content);
    response.end();
};

const success = (request, response) => {
    const responseXML = {
        message: 'This is a successful response',
    };

    //Send XML with success code
    respondXML(request, response, 200, responseXML);
};

const badRequest = (request, response, params) => {

    //Default XML response
    const responseXML = {
        message: 'This request has the required parameters',
    };

    //If parameter is missing or false, send XML with error code
    if (!params || !params.query || !params.query.valid || params.query.valid !== 'true') {
        responseXML.message = 'Missing valid query parameter set to yes';
        responseXML.id = 'badRequest';
        return respondXML(request, response, 400, responseXML);
    }

    //If parameter exists, send XML with success code
    return respondXML(request, response, 200, responseXML);
};

const unauthorized = (request, response, params) => {

    //Default XML response
    const responseXML = {
        message: 'You have successfully viewed the content.',
    };

    //If parameter is missing or false, send XML with 401 code
    if (!params || !params.query || !params.query.loggedIn || params.query.loggedIn !== 'yes') {
        //New message and ID
        responseXML.message = 'Missing loggedIn query parameter set to yes';
        responseXML.id = 'unauthorized';
        return respondXML(request, response, 401, responseXML);
    }

    //If parameter exists, send XML with success code
    return respondXML(request, response, 200, responseXML);
};

const forbidden = (request, response) => {
    const responseXML = {
        message: 'You do not have access to this content.',
        id: 'forbidden',
    };

    //Send XML with error code
    respondXML(request, response, 403, responseXML);
};

const internal = (request, response) => {
    const responseXML = {
        message: 'Internal Server Error. Something went wrong.',
        id: 'internalError',
    };

    //Send XML with error code
    respondXML(request, response, 500, responseXML);
};

const notImplemented = (request, response) => {
    const responseXML = {
        message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
        id: 'notImplemented',
    };

    //Send XML with error code
    respondXML(request, response, 501, responseXML);
};

const anythingElse = (request, response) => {
    const responseXML = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    //Send XML with error code
    respondXML(request, response, 404, responseXML);
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
