
var debug = require('debug')('server:server');
var auth = require('../resources/authentication/authentication.service');
var session = require('express-session');
var passport = require('passport');
var NodeResponse = require('../models/virtual-models/node-response');
var constants = require('../utils/constants');

module.exports = function validateSession(app) {

    app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true })); // session secret
    app.use(auth.initialize());
    app.use(passport.session()); // persistent login sessions

    app.all('*', (req, res, next) => {
        
        if (req.path.includes('login') || req.path.includes('signin') || req.path.includes('create') ) {
            auth.getUserInSession(req.body.email, resp => {
                app.set('user', resp.data );
            });
            return next();
        }
        
        passport.authenticate('jwt', { session: false, failWithError: true }, (err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                var nodeResponse = new NodeResponse();
                nodeResponse.success = false;
                nodeResponse.data = {};
                if(!info) return res.status(401).json(JSON.stringify(nodeResponse));
                if (info.name === 'TokenExpiredError') {
                    nodeResponse.type = constants.ERR_TOKEN_EXPIRED;
                    return res.status(401).json(JSON.stringify(nodeResponse));
                } else {
                    nodeResponse.type = info.message;
                    return res.status(401).json(JSON.stringify(nodeResponse));
                }
            }
            auth.getUserInSession(user, resp => {
                app.set('user', resp.data );
            });

            return next();
        })(req, res, next);
    });
}