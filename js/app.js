'use strict';

/* Polyfills */
require('./polyfills');

/* Dependencies */
var SliderController = require('./slidercontroller');

var AnimatedSliderController = SliderController.extend('moo', {

  init: function( options ) {
    SliderController.init.call(this, options);

    this.options.speed = this.options.speed || 250;

    this.state = {
      animating:  ['is-animating'],
      animateIn:  ['animate-in'],
      active:     ['is-active'],
      animateout: ['animate-out'],
    }
  },

  nextSlide: function() {
    var leavingSlide = this.currentSlide;
    var enteringSlide = ( this.currentSlide + 1 ) % this.nSlides;

    console.log( leavingSlide, enteringSlide)
  },

  prevSlide: function() {
  }

});
