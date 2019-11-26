var debug = require('debug')('server:server');
var constants = require('../../../server/utils/constants');
var responseUtils = require('../../utils/response.utils');
var ratingService = require('./rating.service');

class RatingController {

    // Rating Creation
    createRating(req, res) {
        ratingService.createRating(req.body)
            .then(rating => {
                return responseUtils.returnGeneralResponse(rating, constants.ERR_NO_RATING_CREATED, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Average rating for a selected company
    getAverageRating(req, res) {
        ratingService.getAverageRating(req.body)
            .then(averageRating => {
                return responseUtils.returnGeneralResponse(car, constants.ERR_NO_AVERAGE, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }
}

module.exports = new RatingController();