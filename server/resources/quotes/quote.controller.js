var debug = require('debug')('server:server');
var constants = require('../../../server/utils/constants');
var responseUtils = require('../../utils/response.utils');
var quoteService = require('./quote.service');
var adService = require('../ads/ad.service');
var userService = require('../users/user.service');
var NodeResponse = require('../../models/virtual-models/node-response');
var models = require('../../models');

class QuoteController {

    // get Quote by its ID
    getQuote(req, res) {
        quoteService.getQuote(req.body)
            .then(quote => {
                return responseUtils.returnGeneralResponse(quote, constants.INFO_NO_QUOTE_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // get Quotes related to the Ad in parameter
    getAdQuotes(req, res) {
        quoteService.getAdQuotes(req.query.id_ad)
            .then(quotes => {
                return responseUtils.returnGeneralResponse(quotes, constants.INFO_NO_QUOTE_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // get validated Quote of an Ad
    getValidatedQuoteByAd(req, res) {
        quoteService.getValidatedQuoteByAd(req.query.id_ad)
            .then(quotes => {
                return responseUtils.returnGeneralResponse(quotes, constants.INFO_NO_QUOTE_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // get user's Quotes
    getQuotesByUser(req, res) {
        return _getUsersQuotes(req.body, false, res);
    }

    // get user's waiting Quotes
    getWaitingQuotes(req, res) {
        return _getUsersQuotes(req.query.userId, true, res);
    }

    // get company's waiting Quotes
    getWaitingQuotesByCompany(req, res) {
        var userSession = req.app.get('user');
        quoteService.getWaitingQuotesByCompany(userSession.id_co)
            .then(quote => {
                return responseUtils.returnGeneralResponse(quote, constants.ERR_NO_QUOTE_CREATED, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // get user's accept Quotes
    getAcceptQuotes(req, res) {
        var userSession = req.app.get('user');
        return _getUsersQuotes(userSession.id_co, true, res);
    }

    // Quote Creation
    createQuote(req, res) {
        quoteService.createQuote(req.body)
            .then(quote => {
                return responseUtils.returnGeneralResponse(quote, constants.ERR_NO_QUOTE_CREATED, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Quote Update
    updateQuote(req, res) {
        quoteService.updateQuote(req.body, quotes => {
            return responseUtils.returnGeneralResponse(quotes, constants.ERR_NO_QUOTE_UPDATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Delete Quote
    deleteQuote(req, res) {
        quoteService.deleteQuote(req.body)
            .then(quote => {
                return responseUtils.returnGeneralResponse(quote, constants.ERR_NO_QUOTE_DELETED, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Quote accepted, Ad accepted
    acceptQuote(req, res) {
        var response = new NodeResponse();
        req.body.accept_quote = true;
        quoteService.updateQuote(req.body, quotes => {

            quoteService.getQuote(req.body.id).then(quote => {
                if (quotes) {
                    // Quote found, close Ad too
                    var ad = new models.Ad();
                    ad.id_ad = quote.id_ad;
                    ad.accept_ad = true;
                    adService.updateAd(ad, ads => {
                        return responseUtils.returnGeneralResponse(ads, constants.INFO_NO_ADS_FOUND, res);
                    }, error => {
                        return responseUtils.returnGeneralError(error, res);
                    });
                } else {
                    response.type = constants.INFO_NO_QUOTE_FOUND;
                    return res.json(JSON.stringify(response));
                }
            });
            
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    getAdsWithAcceptedQuotes(req, res) {
        var userSession = req.app.get('user');

        quoteService.getCustomObjectAcceptedOrRejectedQuotes(userSession.id_co, true).then(
            quotes => {
                return responseUtils.returnGeneralResponse(quotes, constants.INFO_NO_ADS_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            }
        );
    };


    getAdsWithRejectedQuotes(req, res) {
        var userSession = req.app.get('user');

        quoteService.getCustomObjectAcceptedOrRejectedQuotes(userSession.id_co, false)
        .then(
            quotes => {
                return responseUtils.returnGeneralResponse(quotes, constants.INFO_NO_ADS_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            }
        );
    }
}

/**
 * Private functions
 */
function _getUsersQuotes(userId, isWaitingQuote, res) {
    if (!isWaitingQuote) {
        quoteService.getQuotesByUser(userId, quotes => {
            return responseUtils.returnGeneralResponse(quotes, constants.INFO_NO_QUOTE_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    } else {
        quoteService.getWaitingQuotes(userId, quotes => {
            return responseUtils.returnGeneralResponse(quotes, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }
}

module.exports = new QuoteController();