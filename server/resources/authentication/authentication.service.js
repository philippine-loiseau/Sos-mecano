var models = require('../../models');
var debug = require('debug')('server:server');
var userService = require('../users/user.service');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var constants = require('../../utils/constants');
var moment = require('moment');
var Strategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var NodeResponse = require('../../models/virtual-models/node-response');
var companyService = require('../company/company.service');
var bCrypt = require('bcrypt-nodejs');


class AuthenticationService {

    initialize() {

        passport.use('guest', new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            (req, email, password, done) => {
                return _processAuthentication(email, password, done);
            }
        ));

        passport.use('jwt',
            new Strategy({
                secretOrKey: constants.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromHeader('authorization')
            }, async (token, done) => {
                try {
                    //Pass the user details to the next middleware
                    var user = {
                        email_user: token.user
                    }
                    done(null, token.user);
                } catch (error) {
                    done(error);
                }
            }));

        return passport.initialize();
    }

    generateToken(user) {

        let expires = moment().utc().add({ seconds: 3600 }).unix();
        const token = user.email_user
            ? jwt.sign({ user: user.email_user }, constants.JWT_SECRET, { expiresIn: 3600 })
            : jwt.sign({ user: user.email_co }, constants.JWT_SECRET, { expiresIn: 3600 });

        return {
            token: token,
            expires: moment.unix(expires).format(),
            user: user.id_user ? user.id_user : user.id_co,
            userType: user.name_co === undefined ? 'driver' : 'company'
        };
    }
    getUserInSession(email, callback) {
        var authenticationInfos = _returnAuthenticationInfo(email, '', true, resp => {
            return callback(resp);
        });
    };
}

function _isValidPassword(userpass, password) {
    return bCrypt.compareSync(password, userpass);
}

function _returnAuthenticationInfo(email, password, byPassPassword, callback) {
    var resp = new NodeResponse();

    var userToConnect = {
        email_user: email,
        password_user: password
    };

    userService.login(userToConnect).then(user => {
        if (!user) {
            var companyToConnect = {
                email_co: email,
                password_co: password
            };
            // Car driver not found, check if company
            companyService.loginCompany(companyToConnect).then(user_co => {
                if (user_co == null) {
                    // Company not found
                    resp.type = constants.ERR_USER_NOT_FOUND;
                    callback(resp);
                } else {
                    // Company found
                    if (_isValidPassword(user_co.password_co, password) || byPassPassword) {
                        // Company authentified
                        resp.data = user_co;
                        resp.type = constants.INFO_COMPANY_CONNECTED;
                        callback(resp);
                    } else {
                        // Company wrong password
                        resp.type = constants.ERR_WRONG_PASSWORD;
                        callback(resp);
                    }
                }
            });
        } else {
            // Car driver found
            if (_isValidPassword(user.password_user, password) || byPassPassword) {
                // Car driver authentified
                resp.data = user;
                resp.type = constants.INFO_USER_CONNECTED;
                callback(resp);
            } else {
                // Car driver wrong password
                resp.type = constants.ERR_WRONG_PASSWORD;
                callback(resp);
            }
        }
    });
}

function _processAuthentication(email, password, done) {
    _returnAuthenticationInfo(email, password, false, resp => {
        done(null, resp.data, resp.type)
    });
}

module.exports = new AuthenticationService();