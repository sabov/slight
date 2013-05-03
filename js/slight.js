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
        this.currSlide = 0;
        this.initSlides();
    };

    Slight.prototype = {
        initSlides: function() {
            var slideHeight = this.$slides.first().outerHeight();
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var slideScale = windowHeight/slideHeight;
            console.log([windowHeight, slideHeight, slideScale]);
            this.$slides.each(function(index, slide) {
                this.showSlide(slide, slideScale- 0.1, windowWidth/2, windowHeight/2);
            }.bind(this));
        },
        showSlide: function(slide, slideScale, x, y) {
            $(slide).css({
                transform: 'translate(-50%, -50%)' +
                    translate({
                        x: x,
                        y: y,
                        z: 0
                    }) + scale(slideScale),
                opacity: '1'
            });
        },
        hideSlide: function(slide) {
            $(slide).css({
                transform: translate({
                    x: 2500,
                    y: 50,
                    z: 0
                }) + scale(0.5),
                opacity: '0'
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
        S = new Slight('.slides');
        $('.prevSlideBtn').on('click', Slight.prev);
        $('.nextSlideBtn').on('click', Slight.next);
    });
})();
