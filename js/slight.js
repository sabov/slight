(function() {

    var translate = function (t) {
        return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
    };
    var rotate = function (r) {
        return " rotateX(" + r.x + "deg) ";
    };

    var scale = function (s) {
        return " scale(" + s + ") ";
    };

    var Slight = function(el) {
        this.$el = $(el);
        this.$slides = this.$el.find('.slide');
        console.log(this.$el);
        this.initSlides();
    };

    Slight.prototype = {
        initSlides: function() {
            this.$slides.each(function(index, slide) {
                this.showSlide(slide);
            }.bind(this));
        },
        showSlide: function(slide) {
            console.log(slide);
            $(slide).css({
                transform: translate({
                    x: 50,
                    y: 50,
                    z: 0
                }) + scale(0.5),
                opacity: '1'
            });
        },
        moveTo: function(index) {

        },
        shift: function(shift) {

        },
        next: function() {
            this.shift(1);
        },
        prev: function() {
            this.shift(-1);
        }
    };
    $(function() {
        new Slight('.slides');
    });
})();
