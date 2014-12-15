'use strict';

var ViewEngine = require('./viewengine');
var Module = require('./module');

var Controller = Module.extend({

    extend: function( id, obj ) {
        var extendedObj = Module.extend.call( this, obj );
        ViewEngine.register( id, extendedObj );
        return extendedObj;
    },

    findController: function( type ) {
        var results = $(this.elements.root).find('[data-controller=' + type + ']');
        var list = [];

        results.each(function() {
            var instanceId = this.dataset.instance;
            list.push( ViewEngine.instances[instanceId].instance );
        });

        return list;
    },

    reAssign: function() {
        var root = this.elements.root;
        this.elements = { root: root };
        ViewEngine.assignBinds( root, this );
        ViewEngine.assignCollections( root, this );
        ViewEngine.assignEvents( root, this );
    }

});

module.exports = Controller;