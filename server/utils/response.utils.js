var debug = require('debug')('server:server');
var NodeResponse = require('../models/virtual-models/node-response');
var constants = require('./constants');

class ResponseUtils {
    returnGeneralError(error, res) {
        var response = new NodeResponse();

        debug('Critical Error: ' + error);
        response.data = error;
        response.type = constants.ERR_GENERAL_ERROR;
        return res.json(JSON.stringify(response));
    }

    returnGeneralResponse(object, constant, res) {
        var response = new NodeResponse();

        if (object) {
            response.data = object;
            response.success = true;
        } else {
            response.type = constant;
        }
        return res.json(JSON.stringify(response));
    }
}

module.exports = new ResponseUtils();
