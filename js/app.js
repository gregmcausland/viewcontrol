// require('./polyfills');
// require('./slidercontroller');

var Module = require('./module');

var a = Module.extend({
  init: function() {
    this.$super.init.call(this);
    console.log('a init');
  }
})

var b = a.extend({
  init: function() {
    this.$super.init.call(this);
    console.log('b init');
  }
})

var c = b.create();




***************************
* FIX INIT RECURSIVE SHIT *
***************************