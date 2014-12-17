(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

var Controller = require('../core/controller');
var Mustache   = require('../core/libs/mustache');

var todoController = Controller.extend('todoController', {

	itemTemplate: '{{#items}}<li class="list-group-item {{state}}">{{item}}<span class="pull-right"><button data-remove data-index="{{index}}" class="btn btn-xs btn-info">Delete</button> <button data-toggle data-index="{{index}}" class="btn btn-xs btn-info">toggle</button></span></li>{{/items}}',

	init: function( options ) {
		this.items = [];
		this.index = 0;
		this.elements.newItem.focus();

		$(this.elements.list)
			.on('click', '[data-remove]', this.removeItem.bind(this) )
			.on('click', '[data-toggle]', this.toggleItem.bind(this) );

		try {
			this.items = JSON.parse(localStorage['todo']).items || [];
			this.renderList();

			var top = 0;
			for ( var i=0, len=this.items.length; i<len; i++ ) {
				top = ( this.items[i].index > top ) ? this.items[i].index : top;
			}
			this.index = top + 1;
		} catch( e ) {};
	},

	addItem: function( e ) {
		e.preventDefault();

		var item = this.elements.newItem.value;
		if ( !item.length ) return;

		this.elements.newItem.value = '';
		this.items.push({ item: item, index: this.index, state: 'inactive' });
		this.index ++;
		this.renderList();
	},

	renderList: function() {
		this.elements.list.innerHTML = Mustache.render(this.itemTemplate, { items: this.items });
		window.localStorage.setItem('todo', JSON.stringify({ items: this.items }));
	},

	removeItem: function( e ) {
		e.preventDefault();
		var target = e.currentTarget;

		this.items.splice( this.findIndex( target.dataset.index ), 1 );
		this.renderList();
	},

	toggleItem: function( e ) {
		e.preventDefault();
		var target = e.currentTarget;
		var item = this.items[this.findIndex( target.dataset.index )];

		item.state = ( item.state === 'inactive' ) ? 'active' : 'inactive';

		this.renderList();
	},

	findIndex: function( index ) {
		for ( var i=0, len=this.items.length; i<len; i++ ) {
			if ( this.items[i].index == index ) {
				return i;
			}
		}
	}

});

module.exports = todoController;
},{"../core/controller":2,"../core/libs/mustache":3}],2:[function(require,module,exports){
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
},{"./module":4,"./viewengine":6}],3:[function(require,module,exports){
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false*/

(function (global, factory) {
  if (typeof exports === "object" && exports) {
    factory(exports); // CommonJS
  } else if (typeof define === "function" && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    factory(global.Mustache = {}); // <script>
  }
}(this, function (mustache) {

  var Object_toString = Object.prototype.toString;
  var isArray = Array.isArray || function (object) {
    return Object_toString.call(object) === '[object Array]';
  };

  function isFunction(object) {
    return typeof object === 'function';
  }

  function escapeRegExp(string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var RegExp_test = RegExp.prototype.test;
  function testRegExp(re, string) {
    return RegExp_test.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace(string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate(template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace() {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags(tags) {
      if (typeof tags === 'string')
        tags = tags.split(spaceRe, 2);

      if (!isArray(tags) || tags.length !== 2)
        throw new Error('Invalid tags: ' + tags);

      openingTagRe = new RegExp(escapeRegExp(tags[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tags[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tags[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens(tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens(tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
      case '^':
        collector.push(token);
        sections.push(token);
        collector = token[4] = [];
        break;
      case '/':
        section = sections.pop();
        section[5] = token[2];
        collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
        break;
      default:
        collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner(string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function () {
    return this.tail === "";
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function (re) {
    var index = this.tail.search(re), match;

    switch (index) {
    case -1:
      match = this.tail;
      this.tail = "";
      break;
    case 0:
      match = "";
      break;
    default:
      match = this.tail.substring(0, index);
      this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context(view, parentContext) {
    this.view = view == null ? {} : view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function (name) {
    var cache = this.cache;

    var value;
    if (name in cache) {
      value = cache[name];
    } else {
      var context = this, names, index;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          while (value != null && index < names.length)
            value = value[names[index++]];
        } else {
          value = context.view[name];
        }

        if (value != null)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer() {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function (tokens, context, partials, originalTemplate) {
    var buffer = '';

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    var self = this;
    function subRender(template) {
      return self.render(template, context, partials);
    }

    var token, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
      case '#':
        value = context.lookup(token[1]);

        if (!value)
          continue;

        if (isArray(value)) {
          for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
            buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
          }
        } else if (typeof value === 'object' || typeof value === 'string') {
          buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
        } else if (isFunction(value)) {
          if (typeof originalTemplate !== 'string')
            throw new Error('Cannot use higher-order sections without the original template');

          // Extract the portion of the original template that the section contains.
          value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

          if (value != null)
            buffer += value;
        } else {
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);
        }

        break;
      case '^':
        value = context.lookup(token[1]);

        // Use JavaScript's definition of falsy. Include empty arrays.
        // See https://github.com/janl/mustache.js/issues/186
        if (!value || (isArray(value) && value.length === 0))
          buffer += this.renderTokens(token[4], context, partials, originalTemplate);

        break;
      case '>':
        if (!partials)
          continue;

        value = isFunction(partials) ? partials(token[1]) : partials[token[1]];

        if (value != null)
          buffer += this.renderTokens(this.parse(value), context, partials, value);

        break;
      case '&':
        value = context.lookup(token[1]);

        if (value != null)
          buffer += value;

        break;
      case 'name':
        value = context.lookup(token[1]);

        if (value != null)
          buffer += mustache.escape(value);

        break;
      case 'text':
        buffer += token[1];
        break;
      }
    }

    return buffer;
  };

  mustache.name = "mustache.js";
  mustache.version = "0.8.2";
  mustache.tags = [ "{{", "}}" ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function (template, view, partials) {
    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.
  mustache.to_html = function (template, view, partials, send) {
    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

}));

},{}],4:[function(require,module,exports){
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
var Module = require('./module');

var ViewEngine = Module.extend({

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

module.exports = ViewEngine.getInstance();
},{"./module":4}],7:[function(require,module,exports){
'use strict';

/* Polyfills */
require('./core/polyfills');

/* Controllers */
require('./controllers/todocontroller');
},{"./controllers/todocontroller":1,"./core/polyfills":5}]},{},[7])