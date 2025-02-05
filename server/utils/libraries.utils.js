var debug = require('debug')('server:server');
var models = require('../models');
var Sequelize = require('sequelize');
var passport = require('passport');

var port;
var server;

function loadLibraries(srv, prt) {

    server = srv
    port = prt;

    // Synchronize Sequelize with mysql database
    models.sequelize.sync()
        .then(function () {
            // Listen on provided port, on all network interfaces.
            server.listen(port);
            server.on('error', onError);
            server.on('listening', onListening);
        });
}

// Event listener for HTTP server "error" event.
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

// Event listener for HTTP server "listening" event.
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}

module.exports = { loadLibraries: loadLibraries }