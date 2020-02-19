/**
 * Byun Swiper 1.1.0
 * Released under the MIT License
 * https://github.com/byunmaster/byunswiper
 */
(function(factory) {
  window.byunSwiper = factory();
})(function() {
  var options = {
    multiple: 1,
    speed: 300,
    loop: false
  };

  var canTransition = !!(function() {
    var bodyStyle = document.body.style;
    return bodyStyle.transition !== undefined;
  })();
  var canTouch = 'ontouchstart' in document.documentElement;

  function onDOMContentLoaded(callback) {
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', callback, false);
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', function() {
        if (document.readyState === 'complete') {
          callback();
        }
      });
    }
  }

  return function(_options) {
    // option setting
    for (var key in _options) {
      options[key] = _options[key];
    }

    // fields
    var $target = options.target;
    if (!$target) {
      throw 'target is null';
    }
    var $container = $target.children[0];
    var $slides = $container.children;
    var currentPage = 1;
    var totalPage = Math.ceil($slides.length / options.multiple);
    var slideWidth = 1;
    var itemWidth = 0;
    var pagesX = [];

    // init
    $container.style.position = 'absolute';

    var fragment = document.createDocumentFragment();
    for (var i = $slides.length, len = totalPage * options.multiple; i < len; i++) {
      var div = document.createElement('div');
      div.style.height = '1px';
      fragment.appendChild(div);
    }
    $container.appendChild(fragment);

    if (options.loop) {
      var prevFragment = document.createDocumentFragment();
      var nextFragment = document.createDocumentFragment();
      for (i = 0, len = options.multiple; i < len; i++) {
        prevFragment.appendChild($slides[$slides.length - len + i].cloneNode(true));
        nextFragment.appendChild($slides[i].cloneNode(true));
      }
      $container.insertBefore(prevFragment, $container.children[0]);
      $container.appendChild(nextFragment);
    }

    // event binding
    onDOMContentLoaded(function() {
      draw();
      if (options.loop) {
        goPage(currentPage);
      }
    });
    window.onresize = resize;

    if (canTransition) {
      $container.addEventListener('transitionend', onSwipeEnd);
    }
    if (canTouch) {
      var timestamp = 0;
      var touchX = 0;
      $container.addEventListener('touchstart', function(e) {
        touchX = e.touches[0].clientX;
        timestamp = e.timeStamp;
      });
      $container.addEventListener('touchend', function(e) {
        var distance = e.changedTouches[0].clientX - touchX;
        var delay = e.timeStamp - timestamp;
        if (delay < 1000 && Math.abs(distance) > 50) {
          if (distance > 0) {
            prev();
          } else {
            next();
          }
        } else {
          movePage(currentPage);
        }
        timestamp = 0;
        touchX = 0;
      });
      $container.addEventListener('touchmove', function(e) {
        var x = pagesX[currentPage] + e.changedTouches[0].clientX - touchX;
        translateX(x);
      });
    }

    // methods
    function draw() {
      slideWidth = $target.offsetWidth;
      itemWidth = slideWidth / options.multiple;
      var slideFragment = document.createDocumentFragment();
      slideFragment.appendChild($container);
      var slides = slideFragment.firstChild.children;
      for (var i = 0, len = slides.length; i < len; i++) {
        slides[i].style.width = itemWidth + 'px';
        slides[i].style.float = 'left';
      }
      slideFragment.firstChild.style.width = slides.length * itemWidth + 'px';
      $target.appendChild(slideFragment);
      setTimeout(function() {
        $target.style.height = $container.offsetHeight + 'px';
      }, 100);
      pagesX = generatePagesX();
    }
    function resize() {
      draw();
      if (options.loop) {
        goPage(currentPage);
      }
    }
    function generatePagesX() {
      var pagesX = [];
      if (options.loop) {
        for (var i = 0; i <= totalPage + 1; i++) {
          pagesX.push(-(i * slideWidth));
        }
      } else {
        pagesX.push(0);
        for (var i = 0; i < totalPage; i++) {
          pagesX.push(-(i * slideWidth));
        }
      }
      return pagesX;
    }
    function goPage(page) {
      currentPage = page;
      swipe(pagesX[page]);
    }
    function movePage(page) {
      options.onStart && options.onStart(swiper);
      currentPage = page;
      transitionDuration(options.speed);
      swipe(pagesX[page]);
    }
    var swipe = (function() {
      return canTransition ? translateX : setLeft;
    })();
    function onSwipeEnd() {
      transitionDuration(0);
      if (options.loop) {
        if (currentPage > totalPage) {
          goPage(1);
        } else if (currentPage < 1) {
          goPage(totalPage);
        }
      }
      options.onEnd && options.onEnd(swiper);
    }
    function transitionDuration(duration) {
      if (!canTransition) {
        return;
      }
      duration += 'ms';
      $container.style['transition-duration'] = duration;
    }
    function translateX(x) {
      var transform = 'translateX(' + x + 'px)';
      $container.style['transform'] = transform;
    }
    function setLeft(x) {
      $container.style.left = x + 'px';
      onSwipeEnd();
    }
    function current() {
      if (currentPage > 0 && currentPage <= totalPage) {
        return currentPage;
      } else if (currentPage === 0) {
        return totalPage;
      }
      return 1;
    }
    function prev() {
      movePage(canPrev() ? --currentPage : currentPage);
    }
    function next() {
      movePage(canNext() ? ++currentPage : currentPage);
    }
    function canPrev() {
      return options.loop || currentPage > 1;
    }
    function canNext() {
      return options.loop || currentPage < totalPage;
    }

    var swiper = {
      current: current,
      prev: prev,
      next: next,
      canPrev: canPrev,
      canNext: canNext,
      loaded: function(callback) {
        callback(this);
        return this;
      }
    };
    return swiper;
  };
});
