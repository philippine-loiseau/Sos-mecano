var debug = require('debug')('server:server');
var constants = require('../../utils/constants');
var carService = require('./car.service');
var responseUtils = require('../../utils/response.utils')

class CarController {

    // Getting user's cars 
    getUserCars(req, res) {
        var userSession = req.app.get('user');
        carService.getUserCars(userSession.id_user)
            .then(car => {
                return responseUtils.returnGeneralResponse(car, constants.INFO_NO_CAR_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Getting specific car
    getCar(req, res) {
        carService.getCar(req.query.carId)
            .then(car => {
                 return responseUtils.returnGeneralResponse(car, constants.INFO_NO_CAR_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Car Creation
    createCar(req, res) {
        carService.createCar(req.body)
            .then(car => {
                return responseUtils.returnGeneralResponse(car, constants.ERR_NO_CAR_CREATED, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Car Update
    updateCar(req, res) {
        carService.updateCar(req.body, cars => {
            return responseUtils.returnGeneralResponse(cars, constants.ERR_NO_CAR_UPDATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Delete Car
    deleteCar(req, res) {
        carService.deleteCar(req.body)
            .then(car => {
                return responseUtils.returnGeneralResponse(car, constants.ERR_NO_CAR_DELETED, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }
}

module.exports = new CarController();