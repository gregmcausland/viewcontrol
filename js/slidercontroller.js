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