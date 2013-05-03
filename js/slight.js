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
        this.initWindowResize();
    };

    Slight.prototype = {
        initSlides: function() {
            var slideHeight = this.$slides.first().outerHeight();
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var slideScale = windowHeight/slideHeight;
            this.$slides.each(function(index, slide) {
                this.showSlide(slide, slideScale- 0.1, windowWidth/2, windowHeight/2);
            }.bind(this));
        },
        initWindowResize: function() {
            var tId;
            var self = this;
            $(window).resize(function() {
                if(tId) window.clearTimeout(tId);
                tId = window.setTimeout(function() {
                    self.initSlides();
                }, 300);
            });

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
                    y: 0,
                    z: 0
                }) + scale(0.5),
                opacity: '0'
            });
        },
        moveTo: function(index) {
            var slideHeight = this.$slides.first().outerHeight();
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var slideScale = windowHeight/slideHeight;
            this.$slides.each(function(index, slide) {
                if(this.currSlide <= index) {
                    this.showSlide(slide, slideScale- 0.1, windowWidth/2, windowHeight/2);
                } else {
                    this.hideSlide(slide);
                }
            }.bind(this));
            this.currSlide = index;

        },
        shift: function(shift) {
            this.moveTo(this.currSlide + shift);
        },
        next: function() {
            this.shift(1);
        },
        prev: function() {
            console.log('prev');
            this.shift(-1);
        }
    };
    $(function() {
        S = new Slight('.slides');
        $('.prevSlideBtn').on('click', S.prev.bind(S));
        $('.nextSlideBtn').on('click', S.next.bind(S));
    });
})();
