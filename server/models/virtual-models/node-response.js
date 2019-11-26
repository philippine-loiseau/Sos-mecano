'use strict';

// NodeResponse model not connected to database
var NodeResponse = function(){
    this.data = {};
    this.success = false;
    this.type = '';
}

module.exports = NodeResponse;