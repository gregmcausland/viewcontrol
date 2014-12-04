/* module.js
 *
 * Baseline extensible inheritable module pattern object. 
 *
 */

"use strict";

var Module = {
    /**
     * Inherits the current class to a new object. 
     *
     * @param  obj          Your member function object.
     * @return instance     the new object. 
     */
    extend: function( obj ) {
        var instance = Object.create( this );
        instance.super = this;
        for ( var method in obj ) {
            instance[method] = obj[method];
        };
        return instance;
    },

    /**
     * Create an instance of this class. 
     *
     * @param  options      init options object for auto init (maybe to be removed)
     * @return instance     the new instance;
     */
    create: function( options ) {
        var instance = Object.create( this );
        instance.init( options );
        return instance;
    },

    /**
     * Baseline init function, automatically involked when create is called. 
     * assigns options to this.options, should always be called from the super object
     * if overloaded:
     *
     * this.super.init.call( this, options ); 
     *
     * @param  obj          init options object.
     */
    init: function( options ) {
        this.options = options || {};
    },

    /**
     * Add an external function to the scope of the current object. Used for exposing
     * private functions to the object scope. Private members inhibit inheritance and are
     * not recommended.
     *
     * @param  method       the method to add to the object.
     */
    expose: function( method ) {
        this[method.name] = method;
    },

    /** 
     * Create an internal singleton instance of the class.
     *
     * return instance        a persistant instance of this class.
     */
     getInstance: function( options ) {
          return this._singleton || ( this._singleton = this.create( options ) );
     }
};

module.exports = Module;
