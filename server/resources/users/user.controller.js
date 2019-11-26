var debug = require('debug')('server:server');
var constants = require('../../../server/utils/constants');
var passport = require('passport');
var responseUtils = require('../../utils/response.utils');
var userService = require('./user.service');
var NodeResponse = require('../../models/virtual-models/node-response');
var authenticationService = require('../authentication/authentication.service');


class UserController {

    // User creation
    createUser(req, res) {
        userService.createUser(req.body, newUser => {
            return responseUtils.returnGeneralResponse(newUser, constants.ERR_NO_USER_CREATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // User update
    updateUser(req, res) {
        userService.updateUser(req.body, usersUpdated => {
            return responseUtils.returnGeneralResponse(usersUpdated, constants.ERR_NO_USER_UPDATED, res);
        }, error => {
            return responseUtils.returnGeneralError(error, res);
        });
    }

    // Find User by its id
    getUserById(req, res) {
        var userSession = req.app.get('user');
        var idUser = userSession ? userSession.id_user: req.query.id;
        userService.findUserById(idUser)
            .then(user => {
                return responseUtils.returnGeneralResponse(user, constants.INFO_NO_USER_FOUND, res);
            }, error => {
                return responseUtils.returnGeneralError(error, res);
            });
    }

    // Login User
    signin(req, res, next) {
        let user = req.body;
        passport.authenticate('guest', (err, user, info) => {
            if (err) {
                return next(err);
            }

            var response = new NodeResponse();
            var tokenObject = authenticationService.generateToken(user);
            response.data.user = user;
            response.data.tokenObject = tokenObject;
            response.type = info;
            response.success = user ? true : false;
            return res.json(JSON.stringify(response));
        })(req, res, next);
    }
}



module.exports = new UserController();