var debug = require('debug')('server:server');
var NodeResponse = require('../models/virtual-models/node-response');
var constants = require('./constants');
var distance = require('google-distance');
var geocoder = require('geocoder');
var request = require("request");


class LocationUtils {

    getAddressByLatLng(latitude, longitude, callback) {
        var options = {
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/geocode/json',
            qs: {
                latlng: latitude + ',' + longitude,
                key: constants.GEOCODING_API_KEY
            },
        };

        request(options, function (error, response, body) {
            if (error) throw new Error(error);
            var jsonBody = JSON.parse(body);
            var address = jsonBody.results[0].address_components[0].long_name + ' ' + jsonBody.results[0].address_components[1].long_name + ' ' + jsonBody.results[0].address_components[2].long_name;

            callback(address);
        });
    }

    getDistanceBetweenAddresses(origin, dest, callback) {
        distance.get(
            {
                origin: origin,
                destination: dest
            },
            function (err, data) {
                if (err) return console.log(err);
                callback(data.distanceValue);
            });
    }

}

module.exports = new LocationUtils();
