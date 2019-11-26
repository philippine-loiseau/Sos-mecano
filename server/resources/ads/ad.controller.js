var models = require('../../models');
var debug = require('debug')('server:server');
var constants = require('../../../server/utils/constants');
var responseUtils = require('../../utils/response.utils');
var adService = require('./ad.service');
var NodeResponse = require('../../models/virtual-models/node-response');

class AdController {

    // get specific Ad 
    getAd(req, res) {
        adService.getAd(req.query.idAd).then(ad => {
            return responseUtils.returnGeneralResponse(ad, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // get all Ads for main display 
    getAds(req, res) {
        adService.getAds().then(ads => {
            return responseUtils.returnGeneralResponse(ads, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // get warning typed Ads 
    getAdsWarning(req, res) {
        adService.getAdsWarning().then(ads => {
            return responseUtils.returnGeneralResponse(ads, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // get non warning typed Ads
    getDefaultAds(req, res) {
        adService.getDefaultAds().then(ads => {
            return responseUtils.returnGeneralResponse(ads, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // get non warning typed Ads
    getDefaultAdsByUser(req, res) {
        var userSession = req.app.get('user');
        adService.getDefaultAdsByUser(userSession).then(ads => {
            return responseUtils.returnGeneralResponse(ads, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    getAdsWarningByUser(req, res) {
        var userSession = req.app.get('user');
        adService.getAdsWarningByUser(userSession).then(ads => {
            return responseUtils.returnGeneralResponse(ads, constants.INFO_NO_ADS_FOUND, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Ad creation
    createAd(req, res) {
        adService.createAd(req.body).then(ad => {
            return responseUtils.returnGeneralResponse(ad, constants.ERR_NO_AD_CREATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Ad update
    updateAd(req, res) {
        adService.updateAd(req.body, ads => {
            return responseUtils.returnGeneralResponse(ads, constants.ERR_NO_ADS_UPDATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Ad update
    deleteAd(req, res) {
        adService.deleteAd(req.body, ads => {
            return responseUtils.returnGeneralResponse(ads, constants.ERR_NO_ADS_UPDATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Search filter AD
    filterAdsByKeyword(req, res) {
        if (req.query.ad_type === 'warning') {
            adService.filterWarningAdsByKeyword(req.query.term).then(
                ads => {
                    return responseUtils.returnGeneralResponse(
                        ads,
                        constants.INFO_NO_ADS_FOUND,
                        res
                    );
                },
                error => {
                    return responseUtils.returnGeneralError(error, res);
                }
            );
        } else {
            adService.filterDefaultAdsByKeyword(req.query.term, req.query.latitude, req.query.longitude, req.query.radius,
                function (ads) {
                    return responseUtils.returnGeneralResponse(
                        ads,
                        constants.INFO_NO_ADS_FOUND,
                        res
                    );
                }
            );
        }
    }

    getAdsWithQuotes(req, res) {
        var userSession = req.app.get('user');
        adService.getAdsWithQuotes(userSession.id_user, ads => {
            return responseUtils.returnGeneralResponse(ads, constants.ERR_NO_ADS_UPDATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }
};

module.exports = new AdController();