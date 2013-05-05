(function() {

    var translate = function (t) {
        return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
    };
    var rotate = function (r) {
        return " rotate(" + r + "deg) ";
    };

    var scale = function (s) {
        return " scale(" + s + ") ";
    };

    var Slight = function(el) {
        this.$el = $(el);
        this.$slides = this.$el.find('.slide');
        this.slideHeight = this.$slides.first().outerHeight();
        this.currSlide = 0;
        this.initSlides();
        this.initWindowResize();
    };

    Slight.prototype = {
        initSlides: function() {
            this.setPosition();
            this.$slides.each(function(index, slide) {
                this.showSlide(slide, index);
            }.bind(this));
        },
        setPosition: function() {
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            this.position = {
                top: windowHeight/2,
                left: windowWidth/2,
                scale: windowHeight/this.slideHeight-0.1
            };
        },
        initWindowResize: function() {
            var tId;
            var self = this;
            $(window).resize(function() {
                if(tId) window.clearTimeout(tId);
                tId = window.setTimeout(function() {
                    self.setPosition();
                    self.moveTo(self.currSlide);
                }, 300);
            });

        },
        showSlide: function(slide, index) {
            var angle = index == this.currSlide? 0 : Math.floor((Math.random()*10)-6);
            var p = this.position;
            $(slide).css({
                transform: 'translate(-50%, -50%)' +
                    translate({
                        x: p.left,
                        y: p.top,
                        z: 0
                    }) + scale(p.scale) +
                    rotate(angle),
                opacity: '1',
                'z-index': this.$slides.length - index
            });
        },
        hideSlide: function(slide) {
            var p = this.position;
            $(slide).css({
                transform: 'translate(-50%, -50%)' +
                    translate({
                        x: 2500,
                        y: p.top,
                        z: 0
                    }) + scale(p.scale),
                opacity: '0'
            });
        },
        moveTo: function(index) {
            this.currSlide = index;
            this.$slides.each(function(i, slide) {
                if(i < index) {
                    this.hideSlide(slide);
                } else {
                    this.showSlide(slide, i);
                }
            }.bind(this));
        },
        shift: function(shift) {
            this.moveTo(this.currSlide + shift);
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
        $('.prevSlideBtn').on('click', S.prev.bind(S));
        $('.nextSlideBtn').on('click', S.next.bind(S));
    });
})();
