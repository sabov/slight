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
    $(document).on('keydown', function (event) {
        if (event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) || (event.keyCode >= 37 && event.keyCode <= 40)) {
            event.preventDefault();
        }
    });
    $(document).on('keyup', function (event) {
        if (event.keyCode === 9 || ( event.keyCode >= 32 && event.keyCode <= 34 ) ||
            (event.keyCode >= 37 && event.keyCode <= 40)) {
            switch(event.keyCode) {
                case 33:  //pg up
                case 37:  //left
                case 38:  //up
                         slides.slight('prev');
                         break;
                case 9:   //tab
                case 32:  //space
                case 34:  //pg down
                case 39:  //right
                case 40:  //down
                         slides.slight('next');
                         break;
            }
            event.preventDefault();
        }
    });
});
