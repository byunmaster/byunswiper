/**
 * Byun Swiper 1.0.1
 * Released under the MIT License
 * https://github.com/byunmaster/byunswiper
 */
window.byunSwiper = function(_options) {
  // option setting
  var options = {
    multiple: 1,
    speed: 300,
    loop: false
  };
  Object.keys(_options).forEach(function(key) {
    options[key] = _options[key];
  });

  // fields
  var $target = options.target;
  if (!$target) {
    throw 'target is null';
  }
  var $container = $target.firstElementChild;
  var $slides = $container.children;
  var currentPage = 1;
  var totalPage = Math.ceil($slides.length / options.multiple);
  var slideWidth = 1;
  var itemWidth = 0;
  var pagesX = [];

  // init
  $target.style.overflow = 'hidden';
  $container.style.display = 'inline-flex';

  var fragment = document.createDocumentFragment();
  for (var i = $slides.length, len = totalPage * options.multiple; i < len; i++) {
    fragment.appendChild(document.createElement('div'));
  }
  $container.appendChild(fragment);

  for (var i = 0, len = $slides.length; i < len; i++) {
    $slides[i].setAttribute('data-idx', i);
    $slides[i].style.textAlign = 'center';
  }

  if (options.loop) {
    var prevFragment = document.createDocumentFragment();
    var nextFragment = document.createDocumentFragment();
    for (i = 0, len = options.multiple; i < len; i++) {
      prevFragment.appendChild($slides[$slides.length - len + i].cloneNode(true));
      nextFragment.appendChild($slides[i].cloneNode(true));
    }
    $container.insertBefore(prevFragment, $container.firstChild);
    $container.appendChild(nextFragment);
  }

  // event binding
  window.addEventListener('DOMContentLoaded', function() {
    draw();
    if (options.loop) {
      goPage(currentPage);
    }
  });
  window.addEventListener('resize', resize);
  $container.addEventListener('transitionend', function(event) {
    $container.style.transitionDuration = '0ms';
    if (options.loop) {
      if (currentPage > totalPage) {
        goPage(1);
      } else if (currentPage < 1) {
        goPage(totalPage);
      }
    }
    options.onEnd && options.onEnd(swiper);
  });

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
    $container.style.transform = 'translateX(' + x + 'px)';
  });

  // methods
  function draw() {
    slideWidth = $target.offsetWidth;
    itemWidth = slideWidth / options.multiple;
    for (var i = 0, len = $slides.length; i < len; i++) {
      $slides[i].style.width = itemWidth + 'px';
    }
    pagesX = generatePagesX();
  }
  function resize(e) {
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
    $container.style.transform = 'translateX(' + pagesX[page] + 'px)';
  }
  function movePage(page) {
    currentPage = page;
    $container.style.transitionDuration = options.speed + 'ms';
    $container.style.transform = 'translateX(' + pagesX[page] + 'px)';
    return {
      canPrev: canPrev,
      canNext: canNext
    };
  }
  function prev() {
    return movePage(canPrev() ? --currentPage : currentPage);
  }
  function next() {
    return movePage(canNext() ? ++currentPage : currentPage);
  }
  function canPrev() {
    return options.loop || currentPage > 1;
  }
  function canNext() {
    return options.loop || currentPage < totalPage;
  }

  var swiper = {
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
