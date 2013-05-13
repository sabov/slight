Slight - presentation engine
==================

### Installation

Clone repository

    git clone git://github.com/sabov/slight.git

To install a packages run:

    bower install

If you have problems with this command, please, install [Twitter Bower](http://twitter.github.com/bower/).

### Initialization

You need to initialize slight by running the following
code. Note that all config values are optional and will default as specified
below.

```javascript
$('.slides').slight({
    animationTime: '.8s',
    animationType: 'ease-in-out',
    margin: 100,
    itemsInRow: 3,
    firstSlide: 0,
    slideSelector: '.slide'
})
```

### API

The ``Slight`` class provides a minimal JavaScript API for controlling
navigation and reading state:

```javascript
$('.slides').slight('prev');
$('.slides').slight('next');
$('.slides').slight('toggleViewMode);
```
### Markup

Example of slide:

```html
<div class="slides">
    <div class="slide">Single Slide</section>
        <h2>Title<h2>
    </div>
</div>
```repository

## License

MIT licensed

Author - Aleksandr Sabov (inspired by Impress and Reveal)

