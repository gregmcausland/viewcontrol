'use strict';

var ViewController = require('./viewcontroller');
var Module = require('./module');

var Controller = Module.extend({

    extend: function( id, obj ) {
        var extendedObj = Module.extend.call( this, obj );
        ViewController.register( id, extendedObj );
        return extendedObj;
    },

    findController: function( type ) {
    },

    reAssign: function() {
        var root = this.elements.root;
        this.elements = { root: root };
        ViewController.assignBinds( root, this );
        ViewController.assignCollections( root, this );
        ViewController.assignClicks( root, this );
    }

});

module.exports = Controller;