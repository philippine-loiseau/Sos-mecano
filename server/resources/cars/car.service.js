var models = require('../../models');
var debug = require('debug')('server:server');

class CarService {

    // Getting user's cars 
    getUserCars(userId) {
        return models.Car.findAll({ where: { id_user: userId } });
    }

    // Getting specific car
    getCar(carId) {
        return models.Car.findOne({ where: { id_car: carId } });
    }

    // Car Creation
    createCar(carToCreate) {
        return models.Car.create({
            car_brand: carToCreate.car_brand,
            car_version: carToCreate.car_version,
            car_model: carToCreate.car_model,
            in_service: carToCreate.in_service,
            photo_car: carToCreate.photo_car,
            id_user: carToCreate.id_user,
            engine: carToCreate.engine,
            licence_plate: carToCreate.licence_plate, 
            serial_number: carToCreate.serial_number
        });
    }

    // Car Update
    updateCar(carToUpdate, callback) {
        models.Car.findOne({ where: { id_car: carToUpdate.id_car } })
            .then(car => {

                _checkIfNotAssigned(carToUpdate, car);

                models.Car.update({
                    car_brand: carToUpdate.car_brand,
                    car_version: carToUpdate.car_version,
                    car_model: carToUpdate.car_model,
                    in_service: carToUpdate.in_service,
                    photo_car: carToUpdate.photo_car
                }, {
                        where: { id_car: carToUpdate.id_car }
                    }).then(carUpdated => callback(carUpdated));
            });
    }

    // Delete Car
    deleteCar(carToDelete) {
        return models.Car.destroy({
            where: {
                id_car: carToDelete.id_car
            }
        });
    }
}

/**
 * Private Functions
 */

// Avoid undefined / null or empty fields update
function _checkIfNotAssigned(carToUpdate) {

    if (!carToUpdate.car_brand) {
        carToUpdate.car_brand = car.car_brand;
    }
    if (!carToUpdate.car_version) {
        carToUpdate.car_version = car.car_version;
    }
    if (!carToUpdate.car_model) {
        carToUpdate.car_model = car.car_model;
    }
    if (!carToUpdate.in_service) {
        carToUpdate.in_service = car.in_service;
    }
    if (!carToUpdate.photo_car) {
        carToUpdate.photo_car = car.photo_car;
    }
}

module.exports = new CarService();