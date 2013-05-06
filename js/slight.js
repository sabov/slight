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
        this.slideWidth = this.$slides.first().outerWidth();
        this.state = '';
        this.currSlide = 0;
        this.initSlides();
        this.initWindowResize();
    };

    Slight.prototype = {
        initSlides: function() {
            this.setPosition();
            this.$slides.each(function(index, slide) {
                this.showSlide(slide, index);
                $(slide).on('click', this.moveTo.bind(this, index));
            }.bind(this));
        },
        setPosition: function() {
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            this.position = {
                top: windowHeight/2,
                left: windowWidth/2,
                scale: windowHeight/this.slideHeight-0.2
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
            this.state = '';
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
        },
        toList: function() {
            var self = this;
            if(this.state == 'list') {
                this.moveTo(this.currSlide);
            } else {
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;
                var slideScale = windowWidth/(3*(this.slideWidth + 200));
                var shift = windowWidth/3;
                var left = shift/2;
                var top = (this.slideHeight+100) * slideScale/2;
                this.$slides.each(function(index, slide) {
                    if(index !== 0 && index % 3 === 0) {
                        left = shift/2;
                        top += (self.slideHeight+100) * slideScale;
                    }
                    $(slide).css({
                        transform: 'translate(-50%, -50%)' +
                            translate({
                                x: left,
                                y: top,
                                z: 0
                            }) + scale(slideScale) +
                            rotate(0),
                        opacity: '1'
                    });
                    left += shift;
                });
                this.state = 'list';
            }
        }
    };
    $(function() {
        S = new Slight('.slides');
        $('.prevSlideBtn').on('click', S.prev.bind(S));
        $('.nextSlideBtn').on('click', S.next.bind(S));
        $('.toListView').on('click', S.toList.bind(S));
    });
})();
