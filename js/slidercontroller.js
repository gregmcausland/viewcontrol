
/* Dependancies */
var Module          = require('./module');
var ViewController  = require('./viewcontroller');

/* Our Module */
var SliderController = Module.extend({

    ACTIVE: 'is-active',

    init: function( options ) {
        this.super.init.call( this, options );
        if ( this.elements.slides.length ) {
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
    }

});

/* Exports */
ViewController.register( 'SliderController', SliderController );
module.exports = SliderController;