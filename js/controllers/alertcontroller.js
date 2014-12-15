/* Dependancies */
var Controller = require('../core/controller');

/* Our Module */
var AlertController = Controller.extend('AlertController', {

    setText: function( text ) {
        this.elements.alert.innerHTML = text;
    }

});

/* Exports */
module.exports = AlertController;