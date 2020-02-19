# Byun Swiper

simple and light swiper for web.

based on es5.

## get started

1. include `<script src="dist/byun.swiper.min.js"></script>` in your html.
2. make a dom tree for swiper.(see example)
3. call function `byunSwiper({ options });`

### example

```
<div class="target">
  <div class="container">
    <div>Slide 1</div>
    <div>Slide 2</div>
    <div>Slide 3</div>
  </div>
</div>
```

```
var swiper = byunSwiper({
  target: document.querySelector('.target')
});
```

## options

| parameter | required |    type     |  default  | description                  |
| --------- | :------: | :---------: | :-------: | ---------------------------- |
| target    |    O     | HTMLElement |   null    | HTMLElement for swiper       |
| multiple  |    X     |   number    |     1     | slide count per page         |
| loop      |    X     |   boolean   |   false   | loop mode                    |
| speed     |    X     |   number    |    300    | transition duration (ms)     |
| onStart   |    X     |  function   | undefined | callback of transition start |
| onEnd     |    X     |  function   | undefined | callback of transition end   |

## methods

| name             | description                            |
| ---------------- | -------------------------------------- |
| current()        | current index (first slide index is 1) |
| prev()           | swipe to previous slide                |
| next()           | swipe to next slide                    |
| canPext()        | is avaiable swipe to previous          |
| canNext()        | is avaiable swipe to next              |
| loaded(callback) | callback of initialize (not async)     |

## support

All. However, if your browser doesn't support transitions, you won't be able to use animation.
