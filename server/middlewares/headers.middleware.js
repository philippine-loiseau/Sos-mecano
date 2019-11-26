var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

module.exports = function setRequestConfig(app) {
    app.use((req, res, next) => {
        _setHeaders(res);
        _setStatusOptions(req, res, next);
    });

    _setBodyRequestParser(app)
}

// add request headers for server communication
function _setHeaders(res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
}

// add status 200 when server well responds with method OPTIONS
function _setStatusOptions(req, res, next) {
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
}

function _setBodyRequestParser(app) {
    // Parsers
    app.use(bodyParser({ limit: '50mb' }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
}
