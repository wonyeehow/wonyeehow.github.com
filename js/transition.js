var page = {},
    util = {};

page.transition = (function() {
  var select = $('.page'),
    len = select.length,
    current = 0,
    next = 1,
    defaultClass = 'page';

  select.eq(0).addClass('page-show');

  $(document).bind('mousewheel DOMMouseScroll', debounce(function (event) {
    if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
      up();
    }
    else {
      down();
    }
  }, 200, true));

  $(document).keydown(function(e) {
    switch(e.which) {
      case 38: // up
        up();
        break;

      case 40: // down
        down();
        break;

      default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
  });

  function up() {
    select.attr('class', defaultClass);
    next = (current - 1) >= 0 ? (current - 1) : len - 1;
    select.eq(current).addClass('page-show page-up-out');
    select.eq(next).addClass('page-show page-up-in');
    current = next;
    bg(current);
  }
  function down() {
    select.attr('class', defaultClass);
    next = (current + 1) < len ? (current + 1) : 0;
    select.eq(current).addClass('page-show page-down-out');
    select.eq(next).addClass('page-show page-down-in');
    current = next;
    bg(current);
  }
  function bg(num) {
    switch(num) {
      case 1:
        page.one();
        break;
    }
  }
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    }
  }
})();

page.one = function() {
  // http://codepen.io/enxaneta/pen/YyjRwB
  var c = document.getElementById("wave");
  var ctx = c.getContext("2d");
  var R = 200,
    R1 = 150,
    A = 0,
    a = 0,
    phi = 0;
  var cw = c.width = window.innerWidth,
    cx = cw / 2;
  var ch = c.height = window.innerHeight,
    cy = ch / 2;

  var rad = (Math.PI / 180);
  var stopped = true;
  var frames = 0;

  var ellipses = 40;
  var r = 400,
    r1 = r / 2;
  var frequency = 25,
    frec;
  var amplitude = 10,
    ampl;
  var phi;

  ctx.lineWidth = 1;

  if (typeof ctx.ellipse === 'function') {
    console.log("It's a function");
  } else {
    ctx.ellipse = function(X, Y, rX, rY, theta, ap, af) {

      for (var a = ap; a < af; a += .1) {
        var x = X + rX * Math.cos(a) * Math.cos(theta) - rY * Math.sin(a) * Math.sin(theta);
        var y = Y + rX * Math.cos(a) * Math.sin(theta) + rY * Math.sin(a) * Math.cos(theta);
        ctx.lineTo(x, y);
      }
      ctx.closePath();
    }
  }

  function newWave(phi, ampl) {
    R = r, R1 = r1, cy = ch / 2;
    cx = cw / 2;
    var x = cx;
    var y = cy;
    var l = 20;

    for (var i = ellipses; i > 0; i--) {
      R -= r / ellipses;
      R1 -= r1 / ellipses;
      l += 100 / (ellipses + 20);

      y += ampl * Math.sin((i * frec * rad) + phi);

      ctx.strokeStyle = 'hsl(200,99%,' + l + '%)';
      ctx.beginPath()
      ctx.ellipse(x, y, R, R1, a, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.globalCompositeOperation = "difference";
    }
  }

  function Draw() {

    frames++
    ctx.clearRect(0, 0, cw, ch);
    phi += .01;
    ampl = amplitude * Math.sin(.1 * frames * rad);
    frec = frequency * Math.sin(.1 * frames * rad);
    ctx.clearRect(0, 0, cw, ch);

    newWave(phi, ampl)

    requestId = window.requestAnimationFrame(Draw);
  }
  Draw();

  function start() {
    requestId = window.requestAnimationFrame(Draw);
    stopped = false;
  }

  function stopAnim() {
    if (requestId) {
      window.cancelAnimationFrame(requestId);
    }
    stopped = true;
  }

  window.addEventListener("load", start(), false);
  c.addEventListener("click", function() {
    (stopped == true) ? start(): stopAnim();
  }, false);
}
