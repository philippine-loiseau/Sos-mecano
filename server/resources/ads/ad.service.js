var models = require('../../models');
var debug = require('debug')('server:server');
var express = require('express');
var userService = require('../users/user.service');

var Sequelize = require('sequelize');
const Op = Sequelize.Op;

var geocoder = require('geocoder');
var request = require("request");
var constants = require('../../utils/constants');
var distance = require('google-distance');

var location = require('../../utils/location.utils');

class AdService {

    // get Ad by user
    getUsersAd(userId) {
        return models.Ad.findAll({
            where: {
                id_user: userId,
                accept_ad: false
            }
        });
    }

    // get specific Ad
    getAd(idAdToFind) {
        return models.Ad.findOne({ where: { id_ad: idAdToFind } });
    }

    // get all Ads for main display 
    getAds() {
        return models.Ad.findAll({ where: { accept_ad: false } });
    }

    // get warning typed Ads 
    getAdsWarning() {
        return models.Ad.findAll({
            where: {
                ad_type: 'warning',
                accept_ad: false
            }
        })
    }

    // get non warning typed Ads
    getDefaultAds() {
        return models.Ad.findAll({
            where: {
                ad_type: {
                    [Op.ne]: 'warning',
                },
                accept_ad: false
            }
        })
    }

    // get non warning typed Ads
    getDefaultAdsByUser(userSession) {
        return models.Ad.findAll({
            where: {
                ad_type: {
                    [Op.ne]: 'warning',
                },
                accept_ad: false,
                id_user: userSession.id_user
            }
        })
    }

    // get warning Ads by user 
    getAdsWarningByUser(userSession) {
        return models.Ad.findAll({
            where: {
                ad_type: 'warning',
                accept_ad: false,
                id_user: userSession.id_user
            }
        })
    }

    // Ad creation
    createAd(adToInsert) {
        return models.Ad.create({
            longitude: adToInsert.longitude,
            token: adToInsert.token,
            description_ad: adToInsert.description_ad,
            accept_ad: adToInsert.accept_ad,
            name_ad: adToInsert.name_ad,
            date_ad: new Date(),
            ad_type: adToInsert.ad_type,
            photo_ad: adToInsert.photo_ad,
            latitude: adToInsert.latitude,
            repair_date: adToInsert.repair_date,
            id_user: adToInsert.userId,
            id_car: adToInsert.id_car
        })
    }

    // Ad update
    updateAd(adToUpdate, callback) {
        models.Ad.findOne({ where: { id_ad: adToUpdate.id_ad } }).then(ad => {
            _checkIfNotAssigned(adToUpdate, ad)

            models.Ad.update({
                longitude: adToUpdate.longitude,
                token: adToUpdate.token,
                description_ad: adToUpdate.description_ad,
                accept_ad: adToUpdate.accept_ad,
                name_ad: adToUpdate.name_ad,
                date_ad: new Date(),
                ad_type: adToUpdate.ad_type,
                photo_ad: adToUpdate.photo_ad,
                latitude: adToUpdate.latitude,
                repair_date: adToUpdate.repair_date
            },
                {
                    where: { id_ad: adToUpdate.id_ad }
                }).then(adUpdated => callback(adUpdated))
        })
    }

    // Ad delete
    deleteAd(adToDelete) {
        return models.Ad.destroy({
            where: {
                id_ad: adToDelete.id_ad
            }
        });
    }

    // Search filter default Ads
    filterDefaultAdsByKeyword(query, latitude, longitude, radius, callbackController) {

        query = query.toUpperCase();
        var list = [];
        var dist = [];
        var userAddresses = [];
        models.Ad.findAll({
            where: {
                /*$or: [
                    { description_ad: { like: '%' + query + '%' } },
                    { distance: { like: '%' + query + '%' } },
                ],*/
                accept_ad: false,
                ad_type: {
                    [Op.ne]: 'warning',
                },
            }
        }).then((ads) => {

            location.getAddressByLatLng(latitude, longitude, address => {
                for (var i = 0; i < ads.length; i++) {
                    userService.findUserById(ads[i].id_user)
                        .then((user) => {
                            var userAddress = user.address_user + ' ' + user.city_user;
                            userAddresses.push(userAddress);
                            location.getDistanceBetweenAddresses(query, userAddress, distance => {
                                dist.push(distance);
                            });
                        })
                }

                setTimeout(() => {
                    for (var j = 0; j < ads.length; j++) {
                        if (dist[j] < (radius * 1000)) {
                            list.push(ads[j]);
                        }
                    }
                }, 3000);

                setTimeout(() => {
                    callbackController(list);
                }, 5000);
            })
        })
    }

    // Search filter default Ads
    filterWarningAdsByKeyword(query) {
        return models.Ad.findAll({
            where: {
                $or: [
                    { description_ad: { like: '%' + query + '%' } },
                    { distance: { like: '%' + query + '%' } },
                ],
                accept_ad: false,
                ad_type: 'warning'
            }
        })
    }

    getAdsWithQuotes(idUser, callback) {
        var adsList = [];
        models.Quote.findAll({
            include: [{
                model: models.Ad,
                where: {
                    ad_type: 'Réparation',
                    id_user: idUser
                }
            }]
        }).then(
            // remove where quote is undefined
            quotes => {
                var map = new Map();
                quotes.forEach(quote => {
                    if(quote.Ad){
                        map.set(quote.Ad.id_ad, quote.Ad)
                    }
                })
            
                for (let [k, v] of map) {
                    adsList.push(v);
                }
                callback(adsList);
            }
        )
    }

    getAcceptedDefaultAds() {
        return models.Ad.findAll({
            where: {
                accept_ad: true,
                ad_type: {
                    [Op.ne]: 'warning',
                }
            }
        })
    }
}

/**
 * Private functions
 */

// Avoid undefined / null or empty fields update
function _checkIfNotAssigned(adToUpdate, ad) {
    if (!adToUpdate.longitude && ad.longitude) {
        adToUpdate.longitude = ad.longitude;
    }
    if (!adToUpdate.token && ad.token) {
        adToUpdate.token = ad.token;
    }
    if (!adToUpdate.description_ad && ad.description_ad) {
        adToUpdate.description_ad = ad.description_ad;
    }
    if (!adToUpdate.accept_ad && ad.accept_ad) {
        adToUpdate.accept_ad = ad.accept_ad;
    }
    if (!adToUpdate.name_ad && ad.name_ad) {
        adToUpdate.name_ad = ad.name_ad;
    }
    if (!adToUpdate.ad_type && ad.ad_type) {
        adToUpdate.ad_type = ad.ad_type;
    }
    if (!adToUpdate.photo_ad && ad.photo_ad) {
        adToUpdate.photo_ad = ad.photo_ad;
    }
    if (!adToUpdate.latitude && ad.latitude) {
        adToUpdate.latitude = ad.latitude;
    }
    if (!adToUpdate.repair_date && ad.repair_date) {
        adToUpdate.repair_date = ad.repair_date;
    }
}

module.exports = new AdService();