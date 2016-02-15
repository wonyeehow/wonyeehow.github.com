var page1 = (function() {
  // http://codepen.io/enxaneta/pen/YyjRwB
  var c = this.document.getElementById("wave");
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
      for (var a = ap; a < af; a += 0.1) {
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
    phi += 0.01;
    ampl = amplitude * Math.sin(0.1 * frames * rad);
    frec = frequency * Math.sin(0.1 * frames * rad);
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
})();
