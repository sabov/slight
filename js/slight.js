(function() {

    /*   Helpers   */

    var translate = function(t) {
        return " translate3d(" + t.x + "px," + t.y + "px," + t.z + "px) ";
    };
    var rotate = function(r) {
        return " rotate(" + r + "deg) ";
    };

    var scale = function(s) {
        return " scale(" + s + ") ";
    };

    var getRandomAngle = function() {
        return Math.floor((Math.random()*10)-6);
    };

    var Slight = function(el) {
        this.$el = $(el);
        this.slides = this.initSlides('.slide');
        this.currSlide = null;
        this.viewMode = '';
        this.itemsInRow = 3;
        if(this.slides.length > 0) {
            var $slide = this.slides[0].$el;
            this.originalSlideSize = {
                width: $slide.outerWidth(),
                height: $slide.outerHeight(),
                margin: 100
            };
            this.toSlidshowView();
            this.initWindowResize();
        }
    };

    Slight.prototype = {
        initSlides: function(selector) {
            var slides = [];
            var $slides = this.$el.find(selector);
            $slides.each(function(index, slide) {
                slides.push({
                    $el: $(slide),
                    position: {}
                });
            });
            return slides;
        },
        initWindowResize: function() {
            var tId;
            var self = this;
            $(window).resize(function() {
                if(tId) window.clearTimeout(tId);
                tId = window.setTimeout(this.refresh.bind(this), 300);
            }.bind(this));
        },
        refresh: function() {
            if(this.viewMode == 'slideshow') {
                this.slides.forEach(function(slide) {
                    this.setSlidePosition(slide, {
                        scale: this.getWindowScale(),
                        y: window.innerHeight/2
                    });
                }.bind(this));
            }
        },
        getWindowScale: function() {
            var windowHeight = window.innerHeight;
            var slideHeight = this.originalSlideSize.height + 2 * this.originalSlideSize.margin;
            return windowHeight/slideHeight;
        },
        toSlidshowView: function() {
            this.slides.forEach(function(slide, index) {
                var angle = index == this.currSlide? 0 : getRandomAngle();
                var windowHeight = window.innerHeight;
                var windowWidth = window.innerWidth;
                this.setSlidePosition(slide, {
                    x: windowWidth/2,
                    y: windowHeight/2,
                    z: this.slides.length - index,
                    scale: windowHeight/(this.originalSlideSize.height +
                        2 * this.originalSlideSize.margin),
                    angle: angle
                });
            }.bind(this));
            this.viewMode = 'slideshow';
        },
        toListView: function() {
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var slideWidth = this.originalSlideSize.width + 2 * this.originalSlideSize.margin;
            var slideHeight = this.originalSlideSize.height + 2 * this.originalSlideSize.margin;
            var slideScale = windowWidth / (this.itemsInRow * slideWidth);
            var shift = windowWidth/this.itemsInRow;
            var left = shift/2;
            var top = slideHeight * slideScale/2;
            this.slides.forEach(function(slide, index) {
                if(index !== 0 && index % this.itemsInRow === 0) {
                    left = shift/2;
                    top += slideHeight * slideScale;
                }
                this.setSlidePosition(slide, {
                    x: left,
                    y: top,
                    z: 0,
                    scale: slideScale,
                    angle: 0
                });
                left += shift;
            }.bind(this));
            this.viewMode = 'list';
        },
        toggleViewMode: function() {
            if(this.viewMode == 'list') {
                this.toSlidshowView();
            } else {
                this.toListView();
            }
        },
        setSlidePosition: function(slide, position) {
            var p = $.extend(slide.position, position);
            slide.$el.css({
                transform: 'translate(-50%, -50%)' +
                    translate({
                        x: p.x,
                        y: p.y,
                        z: p.z
                    }) + scale(p.scale) +
                    rotate(p.angle),
                opacity: '1'
            });
        },
        moveTo: function(index) {
            this.currSlide = index;
            var windowWidth = window.innerWidth;
            this.slides.forEach(function(slide, i) {
                this.setSlidePosition(slide, {
                    x: i < index ? windowWidth * 2 : windowWidth / 2,
                    angle: i == this.currSlide || i == this.currSlide + 1 ? 0 : 
                        slide.position.angle === 0 ? getRandomAngle() : slide.position.angle
                });
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
        $('.toListView').on('click', S.toggleViewMode.bind(S));
    });
})();
