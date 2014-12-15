(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* Dependancies */
var Controller = require('./controller');

/* Our Module */
var AlertController = Controller.extend('AlertController', {

    setText: function( text ) {
        this.elements.alert.innerHTML = text;
    }

});

/* Exports */
module.exports = AlertController;
},{"./controller":2}],2:[function(require,module,exports){
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
        var results = $(this.elements.root).find('[data-controller=' + type + ']');
        var list = [];

        results.each(function() {
            var instanceId = this.dataset.instance;
            list.push( ViewController.instances[instanceId].instance );
        });

        return list;
    },

    reAssign: function() {
        var root = this.elements.root;
        this.elements = { root: root };
        ViewController.assignBinds( root, this );
        ViewController.assignCollections( root, this );
        ViewController.assignEvents( root, this );
    }

});

module.exports = Controller;
},{"./module":4,"./viewcontroller":7}],3:[function(require,module,exports){
'use strict';

/* Polyfills */
require('./polyfills');

/* Dependencies */
var SliderController = require('./slidercontroller');
var AlertController = require('./alertcontroller');
},{"./alertcontroller":1,"./polyfills":5,"./slidercontroller":6}],4:[function(require,module,exports){
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
     * assigns options to this.options, should always be called from the parent class
     * if overloaded:
     *
     * <PARENTCLASS>.init.call( this, options ); 
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

},{}],5:[function(require,module,exports){
/* Object.create() */
if (typeof Object.create != 'function') {
  Object.create = (function() {
    var Object = function() {};
    return function (prototype) {
      if (arguments.length > 1) {
        throw Error('Second argument not supported');
      }
      if (typeof prototype != 'object') {
        throw TypeError('Argument must be an object');
      }
      Object.prototype = prototype;
      var result = new Object();
      Object.prototype = null;
      return result;
    };
  })();
};

/* Function.bind() */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
};
 
/* dataset */ 
(function () {
    'use strict';
    var ObjectProto = Object.prototype,
    defineGetter = ObjectProto.__defineGetter__,
    defineSetter = ObjectProto.__defineSetter__,
    lookupGetter = ObjectProto.__lookupGetter__,
    lookupSetter = ObjectProto.__lookupSetter__,
    hasOwnProp = ObjectProto.hasOwnProperty;
    
    if (defineGetter && defineSetter && lookupGetter && lookupSetter) {
 
        if (!Object.defineProperty) {
            Object.defineProperty = function (obj, prop, descriptor) {
                if (arguments.length < 3) { // all arguments required
                    throw new TypeError("Arguments not optional");
                }
                
                prop += ""; // convert prop to string
 
                if (hasOwnProp.call(descriptor, "value")) {
                    if (!lookupGetter.call(obj, prop) && !lookupSetter.call(obj, prop)) {
                        // data property defined and no pre-existing accessors
                        obj[prop] = descriptor.value;
                    }
 
                    if ((hasOwnProp.call(descriptor, "get") ||
                         hasOwnProp.call(descriptor, "set"))) 
                    {
                        // descriptor has a value prop but accessor already exists
                        throw new TypeError("Cannot specify an accessor and a value");
                    }
                }
 
                // can't switch off these features in ECMAScript 3
                // so throw a TypeError if any are false
                if (!(descriptor.writable && descriptor.enumerable && 
                    descriptor.configurable))
                {
                    throw new TypeError(
                        "This implementation of Object.defineProperty does not support" +
                        " false for configurable, enumerable, or writable."
                    );
                }
                
                if (descriptor.get) {
                    defineGetter.call(obj, prop, descriptor.get);
                }
                if (descriptor.set) {
                    defineSetter.call(obj, prop, descriptor.set);
                }
            
                return obj;
            };
        }
 
        if (!Object.getOwnPropertyDescriptor) {
            Object.getOwnPropertyDescriptor = function (obj, prop) {
                if (arguments.length < 2) { // all arguments required
                    throw new TypeError("Arguments not optional.");
                }
                
                prop += ""; // convert prop to string
 
                var descriptor = {
                    configurable: true,
                    enumerable  : true,
                    writable    : true
                },
                getter = lookupGetter.call(obj, prop),
                setter = lookupSetter.call(obj, prop);
 
                if (!hasOwnProp.call(obj, prop)) {
                    // property doesn't exist or is inherited
                    return descriptor;
                }
                if (!getter && !setter) { // not an accessor so return prop
                    descriptor.value = obj[prop];
                    return descriptor;
                }
 
                // there is an accessor, remove descriptor.writable;
                // populate descriptor.get and descriptor.set (IE's behavior)
                delete descriptor.writable;
                descriptor.get = descriptor.set = undefined;
                
                if (getter) {
                    descriptor.get = getter;
                }
                if (setter) {
                    descriptor.set = setter;
                }
                
                return descriptor;
            };
        }
 
        if (!Object.defineProperties) {
            Object.defineProperties = function (obj, props) {
                var prop;
                for (prop in props) {
                    if (hasOwnProp.call(props, prop)) {
                        Object.defineProperty(obj, prop, props[prop]);
                    }
                }
            };
        }
    }
}());
 
// Begin dataset code
 
if (!document.documentElement.dataset && 
         // FF is empty while IE gives empty object
        (!Object.getOwnPropertyDescriptor(Element.prototype, 'dataset')  ||
        !Object.getOwnPropertyDescriptor(Element.prototype, 'dataset').get)
    ) {
    var propDescriptor = {
        enumerable: true,
        get: function () {
            'use strict';
            var i, 
                that = this,
                HTML5_DOMStringMap, 
                attrVal, attrName, propName,
                attribute,
                attributes = this.attributes,
                attsLength = attributes.length,
                toUpperCase = function (n0) {
                    return n0.charAt(1).toUpperCase();
                },
                getter = function () {
                    return this;
                },
                setter = function (attrName, value) {
                    return (typeof value !== 'undefined') ? 
                        this.setAttribute(attrName, value) : 
                        this.removeAttribute(attrName);
                };
            try { // Simulate DOMStringMap w/accessor support
                // Test setting accessor on normal object
                ({}).__defineGetter__('test', function () {});
                HTML5_DOMStringMap = {};
            }
            catch (e1) { // Use a DOM object for IE8
                HTML5_DOMStringMap = document.createElement('div');
            }
            for (i = 0; i < attsLength; i++) {
                attribute = attributes[i];
                // Fix: This test really should allow any XML Name without 
                //         colons (and non-uppercase for XHTML)
                if (attribute && attribute.name && 
                    (/^data-\w[\w\-]*$/).test(attribute.name)) {
                    attrVal = attribute.value;
                    attrName = attribute.name;
                    // Change to CamelCase
                    propName = attrName.substr(5).replace(/-./g, toUpperCase);
                    try {
                        Object.defineProperty(HTML5_DOMStringMap, propName, {
                            enumerable: this.enumerable,
                            get: getter.bind(attrVal || ''),
                            set: setter.bind(that, attrName)
                        });
                    }
                    catch (e2) { // if accessors are not working
                        HTML5_DOMStringMap[propName] = attrVal;
                    }
                }
            }
            return HTML5_DOMStringMap;
        }
    };
    try {
        // FF enumerates over element's dataset, but not 
        //   Element.prototype.dataset; IE9 iterates over both
        Object.defineProperty(Element.prototype, 'dataset', propDescriptor);
    } catch (e) {
        propDescriptor.enumerable = false; // IE8 does not allow setting to true
        Object.defineProperty(Element.prototype, 'dataset', propDescriptor);
    }
};

/* Classlist */
(function () {

  if (typeof window.Element === "undefined" || "classList" in document.documentElement) return;

  var prototype = Array.prototype,
      push = prototype.push,
      splice = prototype.splice,
      join = prototype.join;

  function DOMTokenList(el) {
    this.el = el;
    // The className needs to be trimmed and split on whitespace
    // to retrieve a list of classes.
    var classes = el.className.replace(/^\s+|\s+$/g,'').split(/\s+/);
    for (var i = 0; i < classes.length; i++) {
      push.call(this, classes[i]);
    }
  };

  DOMTokenList.prototype = {
    add: function(token) {
      if(this.contains(token)) return;
      push.call(this, token);
      this.el.className = this.toString();
    },
    contains: function(token) {
      return this.el.className.indexOf(token) != -1;
    },
    item: function(index) {
      return this[index] || null;
    },
    remove: function(token) {
      if (!this.contains(token)) return;
      for (var i = 0; i < this.length; i++) {
        if (this[i] == token) break;
      }
      splice.call(this, i, 1);
      this.el.className = this.toString();
    },
    toString: function() {
      return join.call(this, ' ');
    },
    toggle: function(token) {
      if (!this.contains(token)) {
        this.add(token);
      } else {
        this.remove(token);
      }

      return this.contains(token);
    }
  };

  window.DOMTokenList = DOMTokenList;

  function defineElementGetter (obj, prop, getter) {
      if (Object.defineProperty) {
          Object.defineProperty(obj, prop,{
              get : getter
          });
      } else {
          obj.__defineGetter__(prop, getter);
      }
  }

  defineElementGetter(Element.prototype, 'classList', function () {
    return new DOMTokenList(this);
  });

})();


/* Array.indexOf */
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);
    var len = O.length >>> 0;

    if (len === 0) {
      return -1;
    }

    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    if (n >= len) {
      return -1;
    }

    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    while (k < len) {
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}
},{}],6:[function(require,module,exports){
/* Dependancies */
var Controller = require('./controller');

/* Our Module */
var SliderController = Controller.extend('SliderController', {

    ACTIVE: 'is-active',

    init: function( options ) {
        Controller.init.call( this, options );
        
        var alertControllers = this.findController('AlertController');
        this.alerter = ( alertControllers.length ) ? alertControllers[0] : null;

        if ( this.elements.slides ) {
            this.nSlides = this.elements.slides.length;
            this.currentSlide = 0;
            this.setSlide( 0 );
        }
    },

    nextSlide: function() {
        this.setSlide( this.currentSlide+1 );
    },

    prevSlide: function() {
        this.setSlide( this.currentSlide-1 );
    },

    setSlide: function( targetSlide ) {
        if ( targetSlide < 0 ) targetSlide = (this.nSlides-1);
        if ( targetSlide > (this.nSlides-1) ) targetSlide = 0;

        this.elements.slides[ this.currentSlide ].classList.remove( this.ACTIVE );
        this.elements.slides[ targetSlide ].classList.add( this.ACTIVE );
        this.currentSlide = targetSlide;

        if ( this.alerter ) {
            this.alerter.setText('Slide set: ' + this.currentSlide);
        }
    }

});

/* Exports */
module.exports = SliderController;
},{"./controller":2}],7:[function(require,module,exports){
var Module = require('./module');

var ViewController = Module.extend({

    CONTROLLER:         'controller',
    BINDING:            'bind',
    COLLECTION:         'collection',
    CLICK:              'click',
    EVENT_PATTERN:      /data-event-(.+)/i,

    DEBUG:      false,

    init: function( options ) {
        Module.init.call( this, options );
        this.controllers = {};
        this.instances = {};
        this.idIterator = 1;
        $( this.assignControllers.bind(this) );
    },

    /**
     * Register a module with an associated id. 
     *
     * @param  id           the id associated with this controller module.
     * @param  module       the module object.
     */
    register: function( id, module ) {
        /* Ensure the passed module is a proper module object */
        if ( typeof module === 'object' && typeof module.init === 'function' ) {
            /* Left as a straight assignment, if you override 
             * an ID I'm assuming it's intended */
            this.controllers[id] = module;
            if ( this.DEBUG ) {
                console.log('Registered: ' + id);
                console.log( '-------' );
            }
        }
    },

    assignControllers: function() {
        var searchTerm = '[data-' + this.CONTROLLER + ']';
        $( searchTerm ).each( this.instanceController.bind(this) );
        this.initControllers();
    },

    instanceController: function( index, item ) {
        var controller = this.controllers[ item.dataset[ this.CONTROLLER ] ];
        if ( controller ) {
            var instance = Object.create( controller );
            var id = this.defineScope( item, instance );
            var options = {};

            this.instances[ id ] = { instance: instance, options: options };

            if ( item.dataset.options ) {
                try {
                    options = JSON.parse( item.dataset.options )
                } catch(e) {
                    options = {};
                }
            }

            if ( this.DEBUG ) {
                console.log( 'Instance of ' + item.dataset[ this.CONTROLLER ] + ' created. id: ' + id );
                console.log( instance );
                console.log( '-------' );
            }
        } else {
            if ( this.DEBUG ) console.log('Controller not defined.');
        }
    },

    initControllers: function() {
        /* In order to cater to certain parent child relationships
         * with nested controllers, we instance everything and then do a batch
         * init after the fact */
         
        var item;

        for ( var controllerInstance in this.instances ) {
            item = this.instances[ controllerInstance ];
            item.instance.init( item.options );
        }
    },

    defineScope: function( item, controllerInstance ) {
        /* If there's no explicit id already set in the HTML 
         * assign a random one */
        var instanceId = item.dataset.instance || 'stv' + (0xFF + ( this.idIterator++ )).toString(16);

        /* create a group on the instance to hold declared elements 
         * and assign the controller element as root */
        controllerInstance.elements = {};
        controllerInstance.elements.root = item;

        /* Populate our elements object with bindings
         * collections and clicks (expandable) */
        this.assignBinds( item, controllerInstance );
        this.assignCollections( item, controllerInstance );
        this.assignEvents( item, controllerInstance );

        item.dataset.instance = instanceId;
        return instanceId;
    },

    assignBinds: function( item, controllerInstance ) {
        var $el = $( item );
        var searchTerm = '[data-' + this.BINDING +']';
        var exclude = $el.find('[data-' + this.CONTROLLER + '] [data-' + this.BINDING +']');

        $el.find( searchTerm ).not(exclude).each(function( index, item ) {
            controllerInstance.elements[ item.dataset[this.BINDING] ] = item;
        }.bind(this));
    },

    assignCollections: function( item, controllerInstance ) {
        var $el = $( item );
        var collections = [];
        var exclude = $el.find('[data-' + this.CONTROLLER + '] [data-' + this.COLLECTION +']');

        /* Construct an array of all the collection id's found */
        $el.find('[data-' + this.COLLECTION + ']').not(exclude).each(function() {
            if ( collections.indexOf( this.dataset.collection ) ) {
                collections.push( this.dataset.collection );
            }
        });

        /* Populate each collection type on the instance */
        for ( var i=0, len=collections.length; i<len; i++ ) {
            controllerInstance.elements[ collections[i] ] = [];
            $el.find('[data-' + this.COLLECTION + '=' + collections[i] + ']').not(exclude).each(function() {
                controllerInstance.elements[ collections[i] ].push(this);
            });
        }
    },

    assignEvents: function ( item, controllerInstance ) {
        var self = this;
        var $el = $( item );
        var exclude = $el.find('[data-' + this.CONTROLLER + '] *');
        var scope = $el.find('*').add($el).not(exclude);

        /* Iterate over all children in scope */
        $(scope).each(function () {
            var $elem = $(this);

            /* Iterate over the element's attributes */
            $.each(this.attributes, function(index, attribute) {
                var matches = attribute.name.match(self.EVENT_PATTERN),
                    handler;

                /* If the current attribute matches data-event-*, attach the specified handler to the event */
                if (matches) {

                    handler = controllerInstance[attribute.value];

                    if (typeof handler === 'function') {
                        $elem.on(matches[1], function (e) {
                            handler.apply(controllerInstance, [e, $elem]);
                        });
                    } else if (self.DEBUG) {
                        console.log('Failed to bind ' + matches[1] + ' handler "' + attribute.value + '"', $elem[0]);
                    }
                }
            });
        });
    }

});

module.exports = ViewController.getInstance();
},{"./module":4}]},{},[3])