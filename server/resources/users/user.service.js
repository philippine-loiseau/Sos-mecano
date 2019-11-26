var models = require('../../models');
var debug = require('debug')('server:server');
var bCrypt = require('bcrypt-nodejs');
var constants = require('./../../utils/constants');
var carService = require('../cars/car.service');


class UserService {

    // Login
    login(userToConnect) {
        // Search in Car Drivers 
        return models.User.findOne({
            where: { email_user: userToConnect.email_user }
        });
    }


    // User creation
    createUser(userToCreate, callback) {
        _generateHash
        var response = models.User.create({
            name_user: userToCreate.name_user,
            email_user: userToCreate.email_user,
            first_name_user: userToCreate.first_name_user,
            tel_user: userToCreate.tel_user,
            address_user: userToCreate.address_user,
            postal_code_user: userToCreate.postal_code_user,
            city_user: userToCreate.city_user,
            creation_user: new Date(),
            password_user: _generateHash(userToCreate.password_user),
            photo_user: userToCreate.photo_user
        });
        response.then(user => {
            userToCreate.id_user = user.id_user;
            carService.createCar(userToCreate).then(
                car => callback(response));
        });
    }

    // User update
    updateUser(userToUpdate, callback) {
        models.User.findOne({ where: { id_user: userToUpdate.id_user } })
            .then(user => {

                _checkIfNotAssigned(userToUpdate, user);

                models.User.update({
                    name_user: userToUpdate.name_user,
                    first_name_user: userToUpdate.first_name_user,
                    tel_user: userToUpdate.tel_user,
                    adress_user: userToUpdate.adress_user,
                    postal_code_user: userToUpdate.postal_code_user,
                    city_user: userToUpdate.city_user,
                    password_user: userToUpdate.password_user,
                    type_mec: userToUpdate.type_mec,
                    photo_user: userToUpdate.photo_user
                }, {
                        where: { id_user: userToUpdate.id_user }
                    })
                    .then(usersUpdated => callback(usersUpdated));
            })
    }

    // Find User by its id
    findUserById(userId) {
        return models.User.findOne({ where: { id_user: userId } });
    }
}

/**
 *  Private functions
*/

function _generateHash(password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

// Avoid undefined / null or empty fields update
function _checkIfNotAssigned(userToUpdate, user) {
    if (!userToUpdate.name_user) {
        userToUpdate.name_user = user.name_user;
    }
    if (!userToUpdate.first_name_user) {
        userToUpdate.first_name_user = user.first_name_user;
    }
    if (!userToUpdate.tel_user) {
        userToUpdate.tel_user = user.tel_user;
    }
    if (!userToUpdate.adress_user) {
        userToUpdate.adress_user = user.adress_user;
    }
    if (!userToUpdate.postal_code_user) {
        userToUpdate.postal_code_user = user.postal_code_user;
    }
    if (!userToUpdate.city_user) {
        userToUpdate.city_user = user.city_user;
    }
    if (!userToUpdate.password_user) {
        userToUpdate.password_user = user.password_user;
    }
    if (!userToUpdate.type_mec) {
        userToUpdate.type_mec = user.type_mec;
    }
    if (!userToUpdate.photo_user) {
        userToUpdate.photo_user = user.photo_user;
    }
}

module.exports = new UserService();