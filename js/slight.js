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

    var transition = (function() {
        var result;
        var el = document.createElement('fakeelement');
        var transitions = [
          'transition',
          'OTransition',
          'MozTransition',
          'WebkitTransition'
        ];

        transitions.forEach(function(t){
            if(el.style[t] !== undefined){
                result = t;
            }
        });
        return result;
    })();

    var transitionEnd = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }[transition];

    /*   Config    */

    var defaults = {
        animationTime: '.8s',
        animationType: 'ease-in-out',
        margin: 100,
        itemsInRow: 3,
        firstSlide: 0,
        slideSelector: '.slide'
    };

    var Slight = function(el, options) {
        this.$el = $(el);
        this.options = options;
        this.slides = this.initSlides(options.slideSelector);
        this.currSlide = options.firstSlide;
        this.viewMode = '';
        this.itemsInRow = options.itemsInRow;
        if(this.slides.length > 0) {
            var $slide = this.slides[0].$el;
            this.originalSlideSize = {
                width: $slide.outerWidth(),
                height: $slide.outerHeight(),
                margin: options.margin
            };
            this.toSlideshowView(0);
            this.setAnimation();
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
        setAnimation: function() {
            var animation = 'all ' + this.options.animationType + ' ' +
                this.options.animationTime;
            setTimeout(function() {
                this.slides.forEach(function(slide) {
                    slide.$el.css(transition, animation);
                });
            }.bind(this), 0);
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
                        y: window.innerHeight/2,
                        x: window.innerWidth/2
                    });
                }.bind(this));
            }
        },
        getWindowScale: function() {
            var windowHeight = window.innerHeight;
            var slideHeight = this.originalSlideSize.height + 2 * this.originalSlideSize.margin;
            return windowHeight/slideHeight;
        },
        toSlideshowView: function(index) {
            if(index < 0 || index >= this.slides.length) {
                return;
            }

            $('body').css('overflow', 'hidden');
            this.currSlide = index;
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            this.slides.forEach(function(slide, i) {
                var angle = i == this.currSlide || i == this.currSlide + 1 ? 0 :
                        !slide.position.angle || slide.position.angle === 0 ? getRandomAngle() :
                        slide.position.angle;
                this.setSlidePosition(slide, {
                    x: i < index ? windowWidth * 2 : windowWidth / 2,
                    y: windowHeight/2,
                    z: this.slides.length - i,
                    scale: windowHeight/(this.originalSlideSize.height +
                        2 * this.originalSlideSize.margin),
                    angle: angle,
                    opacity: 1
                });
            }.bind(this));
            this.viewMode = 'slideshow';
            this.setBodyStyle('overflow', 'hidden');
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
            this.setBodyStyle('overflow-y', 'scroll');
        },
        setBodyStyle: function(prop, value) {
            this.slides[0].$el.on(transitionEnd, function() {
                console.log([prop, value]);
                $(this).off(transitionEnd);
                $('body').css(prop, value);
            });
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
                opacity: p.opacity
            });
        },
        toggleViewMode: function() {
            if(this.viewMode == 'list') {
                this.toSlideshowView(this.currSlide);
            } else {
                this.toListView();
            }
        },
        next: function() {
            this.toSlideshowView(this.currSlide + 1);
        },
        prev: function() {
            this.toSlideshowView(this.currSlide - 1);
        }
    };

    var publicAPI = ['prev', 'next', 'toggleViewMode'];

    $.fn.slight = function(arg) {
        return this.each(function (i, el) {
            var $el = $(el);
            var slight = $el.data('slight');
            var options = $.extend({}, defaults, typeof arg == 'object' && arg);
            if(!slight) $el.data('slight', (slight = new Slight($el, options)));
            if(typeof arg == 'string' && publicAPI.indexOf(arg) >= 0) slight[arg]();
        });
    };
    $(function() {
        var slides = $('.slides');
        slides.slight();
        $('.prevSlideBtn').on('click', function() {
            slides.slight('prev');
        });
        $('.nextSlideBtn').on('click', function() {
            slides.slight('next');
        });
        $('.toListView').on('click', function() {
            slides.slight('toggleViewMode');
        });
    });
})();
