!function t(e,n,i){function r(s,c){if(!n[s]){if(!e[s]){var a="function"==typeof require&&require;if(!c&&a)return a(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return r(n?n:t)},l,l.exports,t,e,n,i)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)r(i[s]);return r}({1:[function(t){t("./polyfills"),t("./slidercontroller")},{"./polyfills":3,"./slidercontroller":4}],2:[function(t,e){"use strict";var n={extend:function(t){var e=Object.create(this);e.$super=this;for(var n in t)e[n]=t[n];return e},create:function(t){var e=Object.create(this);return e.init(t),e},init:function(t){this.options=t||{}},expose:function(t){this[t.name]=t},getInstance:function(t){return this._singleton||(this._singleton=this.create(t))}};e.exports=n},{}],3:[function(){if("function"!=typeof Object.create&&(Object.create=function(){var t=function(){};return function(e){if(arguments.length>1)throw Error("Second argument not supported");if("object"!=typeof e)throw TypeError("Argument must be an object");t.prototype=e;var n=new t;return t.prototype=null,n}}()),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),n=this,i=function(){},r=function(){return n.apply(this instanceof i&&t?this:t,e.concat(Array.prototype.slice.call(arguments)))};return i.prototype=this.prototype,r.prototype=new i,r}),function(){"use strict";var t=Object.prototype,e=t.__defineGetter__,n=t.__defineSetter__,i=t.__lookupGetter__,r=t.__lookupSetter__,o=t.hasOwnProperty;e&&n&&i&&r&&(Object.defineProperty||(Object.defineProperty=function(t,s,c){if(arguments.length<3)throw new TypeError("Arguments not optional");if(s+="",o.call(c,"value")&&(i.call(t,s)||r.call(t,s)||(t[s]=c.value),o.call(c,"get")||o.call(c,"set")))throw new TypeError("Cannot specify an accessor and a value");if(!(c.writable&&c.enumerable&&c.configurable))throw new TypeError("This implementation of Object.defineProperty does not support false for configurable, enumerable, or writable.");return c.get&&e.call(t,s,c.get),c.set&&n.call(t,s,c.set),t}),Object.getOwnPropertyDescriptor||(Object.getOwnPropertyDescriptor=function(t,e){if(arguments.length<2)throw new TypeError("Arguments not optional.");e+="";var n={configurable:!0,enumerable:!0,writable:!0},s=i.call(t,e),c=r.call(t,e);return o.call(t,e)?s||c?(delete n.writable,n.get=n.set=void 0,s&&(n.get=s),c&&(n.set=c),n):(n.value=t[e],n):n}),Object.defineProperties||(Object.defineProperties=function(t,e){var n;for(n in e)o.call(e,n)&&Object.defineProperty(t,n,e[n])}))}(),!(document.documentElement.dataset||Object.getOwnPropertyDescriptor(Element.prototype,"dataset")&&Object.getOwnPropertyDescriptor(Element.prototype,"dataset").get)){var t={enumerable:!0,get:function(){"use strict";var t,e,n,i,r,o,s=this,c=this.attributes,a=c.length,l=function(t){return t.charAt(1).toUpperCase()},u=function(){return this},f=function(t,e){return"undefined"!=typeof e?this.setAttribute(t,e):this.removeAttribute(t)};try{({}).__defineGetter__("test",function(){}),e={}}catch(h){e=document.createElement("div")}for(t=0;a>t;t++)if(o=c[t],o&&o.name&&/^data-\w[\w\-]*$/.test(o.name)){n=o.value,i=o.name,r=i.substr(5).replace(/-./g,l);try{Object.defineProperty(e,r,{enumerable:this.enumerable,get:u.bind(n||""),set:f.bind(s,i)})}catch(d){e[r]=n}}return e}};try{Object.defineProperty(Element.prototype,"dataset",t)}catch(e){t.enumerable=!1,Object.defineProperty(Element.prototype,"dataset",t)}}!function(){function t(t){this.el=t;for(var e=t.className.replace(/^\s+|\s+$/g,"").split(/\s+/),n=0;n<e.length;n++)i.call(this,e[n])}function e(t,e,n){Object.defineProperty?Object.defineProperty(t,e,{get:n}):t.__defineGetter__(e,n)}if(!("undefined"==typeof window.Element||"classList"in document.documentElement)){var n=Array.prototype,i=n.push,r=n.splice,o=n.join;t.prototype={add:function(t){this.contains(t)||(i.call(this,t),this.el.className=this.toString())},contains:function(t){return-1!=this.el.className.indexOf(t)},item:function(t){return this[t]||null},remove:function(t){if(this.contains(t)){for(var e=0;e<this.length&&this[e]!=t;e++);r.call(this,e,1),this.el.className=this.toString()}},toString:function(){return o.call(this," ")},toggle:function(t){return this.contains(t)?this.remove(t):this.add(t),this.contains(t)}},window.DOMTokenList=t,e(Element.prototype,"classList",function(){return new t(this)})}}(),Array.prototype.indexOf||(Array.prototype.indexOf=function(t,e){var n;if(null==this)throw new TypeError('"this" is null or not defined');var i=Object(this),r=i.length>>>0;if(0===r)return-1;var o=+e||0;if(1/0===Math.abs(o)&&(o=0),o>=r)return-1;for(n=Math.max(o>=0?o:r-Math.abs(o),0);r>n;){if(n in i&&i[n]===t)return n;n++}return-1})},{}],4:[function(t,e){var n=t("./module"),i=t("./viewcontroller"),r=n.extend({ACTIVE:"is-active",init:function(t){this.$super.init.call(this,t),this.elements.slides.length&&(this.nSlides=this.elements.slides.length,this.currentSlide=0,this.setSlide(0))},nextSlide:function(){this.setSlide(this.currentSlide+1)},prevSlide:function(){this.setSlide(this.currentSlide-1)},setSlide:function(t){0>t&&(t=this.nSlides-1),t>this.nSlides-1&&(t=0),this.elements.slides[this.currentSlide].classList.remove(this.ACTIVE),this.elements.slides[t].classList.add(this.ACTIVE),this.currentSlide=t}});i.register("SliderController",r),e.exports=r},{"./module":2,"./viewcontroller":5}],5:[function(t,e){var n=t("./module"),i=n.extend({CONTROLLER:"controller",BINDING:"bind",COLLECTION:"collection",CLICK:"click",DEBUG:!0,init:function(t){this.$super.init.call(this,t),this.controllers={},this.instances={},this.idIterator=1,$(this.assignControllers.bind(this))},register:function(t,e){"object"==typeof e&&"function"==typeof e.init&&(this.controllers[t]=e,this.DEBUG&&(console.log("Registered: "+t),console.log("-------")))},assignControllers:function(){var t="[data-"+this.CONTROLLER+"]";$(t).each(this.instanceController.bind(this))},instanceController:function(t,e){var n=this.controllers[e.dataset[this.CONTROLLER]];if(n){var i=Object.create(n),r=this.defineScope(e,i),o={};if(this.instances[r]=i,e.dataset.options)try{o=JSON.parse(e.dataset.options)}catch(s){o={}}i.init(o),this.DEBUG&&(console.log("Instance of "+e.dataset[this.CONTROLLER]+" created. id: "+r),console.log(i),console.log("-------"))}else this.DEBUG&&console.log("Controller not defined.")},defineScope:function(t,e){var n=t.dataset.instance||"stv"+(255+this.idIterator++).toString(16);return e.elements={},e.elements.root=t,this.assignBinds(t,e),this.assignCollections(t,e),this.assignClicks(t,e),t.dataset.instance=n,n},assignBinds:function(t,e){var n="[data-"+this.BINDING+"]";$(t).find(n).each(function(t,n){e.elements[n.dataset[this.BINDING]]=n}.bind(this))},assignCollections:function(t,e){var n=$(t),i=[];n.find("[data-"+this.COLLECTION+"]").each(function(){i.indexOf(this.dataset.collection)&&i.push(this.dataset.collection)});for(var r=0,o=i.length;o>r;r++)e.elements[i[r]]=[],n.find("[data-"+this.COLLECTION+"="+i[r]+"]").each(function(){e.elements[i[r]].push(this)})},assignClicks:function(t,e){var n=$(t);n.find("[data-"+this.CLICK+"]").each(function(){$(this).on("click",e[this.dataset.click].bind(e))})}});e.exports=i.getInstance()},{"./module":2}]},{},[1]);