$(function(){
  var yeehow = {
    transition: (function() {
      var select = $('.page'),
        len = select.length,
        current = 0,
        next = 1,
        defaultClass = 'page';

      select.eq(0).addClass('page-show');

      select.bind('mousewheel DOMMouseScroll', debounce(function (e) {
        if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
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
        select.attr('class', defaultClass).removeAttr('style');
        next = (current - 1) >= 0 ? (current - 1) : len - 1;
        select.eq(current).addClass('page-show page-up-out');
        select.eq(next).addClass('page-show page-up-in');

        TweenMax.fromTo($('.page-up-out'), 1, {
          opacity: 1,
          scale: 1
        }, {
          opacity: 0,
          scale: .8,
          clearProps: 'opacity, scale'
        });
        TweenMax.fromTo($('.page-up-in'), 1, {
          top: -3000
        }, {
          top: 0,
          delay: 1
        });

        current = next;
        bg(current);
        yeehow.descOff();
      }
      function down() {
        select.attr('class', defaultClass).removeAttr('style');
        next = (current + 1) < len ? (current + 1) : 0;
        select.eq(current).addClass('page-show page-down-out');
        select.eq(next).addClass('page-show page-down-in');

        TweenMax.fromTo($('.page-down-out'), 1, {
          opacity: 1,
          scale: 1
        }, {
          opacity: 0,
          scale: .8,
          clearProps: 'opacity, scale'
        });
        TweenMax.fromTo($('.page-down-in'), 1, {
          top: 3000
        }, {
          top: 0,
          delay: 1
        });

        current = next;
        bg(current);
        yeehow.descOff();
      }

      function bg(num) {
        yeehow.stopFx();
        switch(num+1) {
          case 1:
            yeehow.fxParallax($('#page1 .bg'));
            break;
          case 2:
            yeehow.fxBubble($('#page2 .bg'));
            break;
          case 3:
            //yeehow.fxSphere($('#page3 .bg'));
            break;
          case 4:
            //yeehow.fxNest($('#page4 .bg'));
            break;
          case 5:
            //yeehow.page5();
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
    })(),
    desc: (function() {
      var link = $('.link a');
      var close = $('.desc-close');
      link.click(function(){
        var t = $(this);

        yeehow.descOff();

        // activate
        t.addClass('active');
        t.parents('.page').addClass('page-desc');
        $(t.attr('href')).addClass('active');
        close.addClass('active');
      });

      close.click(function() {
        yeehow.descOff();
      });

    })(),
    descOff: function() {
      $('.page').removeClass('page-desc');
      $('.link a').removeClass('active');
      $('.desc').removeClass('active');
      $('.desc-close').removeClass('active');        
    },
    page1: function(){
      var bg = $('#page1 .bg');
      bg.mousemove(function(e){
        var mousePosX = (e.pageX/$(window).width())* -10;
        var mousePosY = (e.pageY/$(window).height())* -10;
        bg.css({
          'margin-left': mousePosX+'%',
          'margin-top': mousePosY+'%'
        });
      });
    },
    fxParallax: function(el) {
      var touches = function(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX, 
            y = e.touches ? e.touches[0].clientY : e.clientY;
        
        var w = window.innerWidth / 2;
        var h = window.innerHeight / 2;
        
        var l = -(x - w) / (w / 10) - 10;
        var t = -(y - h) / (h / 10) - 10;
        
        TweenMax.to(el, 1, {
          top: t + "%",
          left: l + "%"
        });
        
      }
      window.addEventListener("mousemove", touches);
      window.addEventListener("touchstart", touches);
      window.addEventListener("touchmove", touches);
    },
    fxBubble: function(el) {
      var colorlist = ['#05668D', '#028090', '#00A896', '#02C39A', '#F0F3BD'];
      function random(min, max){
        return (Math.random() * (max - min)) + min;
      }

      el.append('<div id="fxBubble"></div>');

      for (var i=0; i<200; i++) {
        var size = random(20, 40).toFixed();
        var alpha = random(0.3, 0.6).toFixed(1);
        var color = random(0, 4).toFixed();
        var dot = $('<div class="dot"></div>')
        var w = window.innerWidth;
        var h = window.innerHeight;
        var x = random(0, w),
            y = random(0, h),
            z = random(-1000, -200);

        dot.appendTo('#fxBubble').css({
          'height': size,
          'width': size,
          'background-color': colorlist[color]
        })
        TweenMax.fromTo(dot, 3, {
            opacity: 0,
            x: x,
            y: y,
            z: z
          }, {
            opacity: .5,
            x: x,
            y: y,
            z: 500,
            repeat: -1,
            delay: i * -.015
        });
      }
      var touches = function(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX, 
            y = e.touches ? e.touches[0].clientY : e.clientY;
        
        TweenMax.to($('#fxBubble'), 1, {
          webkitPerspectiveOrigin: x + "px " + y +"px",
          perspectiveOrigin: x + "px " + y +"px"
        });
        
      }

      window.addEventListener("mousemove", touches);
      window.addEventListener("touchstart", touches);
      window.addEventListener("touchmove", touches);
    },
    page5: function(){
      var width, height, largeHeader, canvas, ctx, triangles, target, animateHeader = true;
      var colors = ['72,35,68', '43,81,102', '66,152,103', '250,178,67', '224,33,48'];

      // Main
      initHeader();
      addListeners();
      initAnimation();

      function initHeader() {
          width = window.innerWidth;
          height = window.innerHeight;
          target = {x: 0, y: height};

          largeHeader = $('#page5 .bg');
          largeHeader[0].style.height = height+'px';

          largeHeader.append('<canvas id="bgfx"></canvas>');
          canvas = document.getElementById('bgfx');
          canvas.width = width;
          canvas.height = height;
          ctx = canvas.getContext('2d');

          // create particles
          triangles = [];
          for(var x = 0; x < 480; x++) {
              addTriangle(x*10);
          }
      }

      function addTriangle(delay) {
          setTimeout(function() {
              var t = new Triangle();
              triangles.push(t);
              tweenTriangle(t);
          }, delay);
      }

      function initAnimation() {
          animate();
      }

      function tweenTriangle(tri) {
          var t = Math.random()*(2*Math.PI);
          var x = (200+Math.random()*100)*Math.cos(t) + width*0.5;
          var y = (200+Math.random()*100)*Math.sin(t) + height*0.5-20;
          var time = 4+3*Math.random();

          TweenLite.to(tri.pos, time, {x: x,
              y: y, ease:Circ.easeOut,
              onComplete: function() {
                  tri.init();
                  tweenTriangle(tri);
          }});
      }

      // Event handling
      function addListeners() {
          window.addEventListener('scroll', scrollCheck);
          window.addEventListener('resize', resize);
      }

      function scrollCheck() {
          if(document.body.scrollTop > height) animateHeader = false;
          else animateHeader = true;
      }

      function resize() {
          width = window.innerWidth;
          height = window.innerHeight;
          largeHeader[0].style.height = height+'px';
          canvas.width = width;
          canvas.height = height;
      }

      function animate() {
          if(animateHeader) {
              ctx.clearRect(0,0,width,height);
              for(var i in triangles) {
                  triangles[i].draw();
              }
          }
          requestAnimationFrame(animate);
      }

      // Canvas manipulation
      function Triangle() {
          var _this = this;

          // constructor
          (function() {
              _this.coords = [{},{},{}];
              _this.pos = {};
              init();
          })();

          function init() {
              _this.pos.x = width*0.5;
              _this.pos.y = height*0.5-20;
              _this.coords[0].x = -10+Math.random()*40;
              _this.coords[0].y = -10+Math.random()*40;
              _this.coords[1].x = -10+Math.random()*40;
              _this.coords[1].y = -10+Math.random()*40;
              _this.coords[2].x = -10+Math.random()*40;
              _this.coords[2].y = -10+Math.random()*40;
              _this.scale = 0.1+Math.random()*0.3;
              _this.color = colors[Math.floor(Math.random()*colors.length)];
              setTimeout(function() { _this.alpha = 0.8; }, 10);
          }

          this.draw = function() {
              if(_this.alpha >= 0.005) _this.alpha -= 0.005;
              else _this.alpha = 0;
              ctx.beginPath();
              ctx.moveTo(_this.coords[0].x+_this.pos.x, _this.coords[0].y+_this.pos.y);
              ctx.lineTo(_this.coords[1].x+_this.pos.x, _this.coords[1].y+_this.pos.y);
              ctx.lineTo(_this.coords[2].x+_this.pos.x, _this.coords[2].y+_this.pos.y);
              ctx.closePath();
              ctx.fillStyle = 'rgba('+_this.color+','+ _this.alpha+')';
              ctx.fill();
          };

          this.init = init;
      }
    },
    stopFx: function() {
      $('#fxBubble').remove();
      $('#bgfx').remove();
    },
    fxWave: function(el) {
      el.append('<canvas id="bgfx"></canvas>');
      yeehow.bgpos();
      var c = document.getElementById("bgfx");
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
    },
    fxSphere: function(el) {
      el.append('<canvas id="bgfx"></canvas>');
      yeehow.bgpos();
      var c = document.getElementById("bgfx");
      var ctx = c.getContext("2d");

      var cw = c.width = window.innerWidth,
        cx = cw / 2;
      var ch = c.height = window.innerHeight,
        cy = ch / 2;

      var rad = (Math.PI / 180);

      var a = 0;
      var R = ch/3;
      var speed = .02;
      var D = 2 * R,
        d;
      var y = cy + R,
        i = 0;
      var phi = 0;
      var num = 10;

      function Draw() {

        a++;
        if (phi >= 1) {
          phi = 0;
        } else {
          phi += speed;
        }

        ctx.clearRect(0, 0, cw, ch);
        for (var i = -num; i < num; i++) {

          d = 2 * Math.sqrt(R * R - (R / num) * (i + phi) * (R / num) * (i + phi));
          y = cy - (i + phi) * (R *.9 / num);

          drawElipse(cx, y, d, d / 2, a)
        }
        requestId = window.requestAnimationFrame(Draw);
      }
      requestId = window.requestAnimationFrame(Draw);

      function drawElipse(cx, cy, W, H, a) {
        var rx = W / 2;
        var ry = H / 2;
        for (var i = 0; i < 360; i += 10) {
          ctx.fillStyle = "hsl(180,100%," + ((Math.cos((i + a - 90) * rad) * 50) + 50) + "%)";
          var xp = cx + rx * Math.cos((i + a) * rad);
          var yp = cy + ry * Math.sin((i + a) * rad);
          ctx.beginPath();
          ctx.arc(xp, yp, d / 100, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    },
    fxNest: function(el) {
      el.append('<canvas id="bgfx"></canvas>');
      yeehow.bgpos();
      var c = document.getElementById('bgfx');
      var ctx = c.getContext("2d");

      var cw = c.width = window.innerWidth,cx = cw/2;
      var ch = c.height = window.innerHeight,cy = ch/2;

      var rad = Math.PI / 180;
      var angle = rad * 360 / 6;
      var offset = 0; // offset angle
      var amplitude = 18;
      var speed = .05;

      var R = 30,
        r1 = 5 * R / 6;
      var inner = (Math.sqrt(3) / 2) * R;
      var d = R + Math.sin(Math.PI / 6) * R;

      ctx.fillStyle = 'rgba(0,0,0,.04)';
      ctx.lineWidth = 2;

      /*var colors = ["#F57D7E", "#EF5770", "#EC3A62", "#C53464", "#8C215C", "#712776"];*/
      var colors = ["#f5b070", "#f29640", "#ee7c11", "#bf630d", "#8f4a0a", "#5f3207"];
      var points = [];
      var I = 0,
        iRy = []; //cell to animate

      function hexagon(r, c, hue) {
        ctx.strokeStyle = c.color;
        var offset = c.offset;
        ctx.beginPath();
        for (var i = 0; i < 6; i++) {
          ctx.lineTo(c.x + c.r * Math.cos(offset + angle * i), c.y + c.r * Math.sin(offset + angle * i));
        }
        ctx.closePath();
        ctx.stroke();
      }

      function layer(num) {
        var r = inner * (2 * (num - 1));

        var o = [];

        o[0] = {}
        o[0].n = 0
        o[0].x = cx + r * Math.cos(30 * rad);
        o[0].y = cy + r * Math.sin(30 * rad);
        o[0].color = colors[num - 1];
        o[0].layer = num;

        for (var i = 1; i <= 6; i++) {

          var n = o.length;

          var olast = {}
          olast.n = n + num - 2
          olast.x = cx + r * Math.cos((60 * i + 30) * rad);
          olast.y = cy + r * Math.sin((60 * i + 30) * rad);
          olast.color = colors[num - 1];
          olast.layer = num;

          for (var l = 0; l < num - 2; l++) {

            o[n + l] = {}
            o[n + l].n = n + l
            o[n + l].x = o[n - 1].x - (l + 1) * (o[n - 1].x - olast.x) / (num - 1);
            o[n + l].y = o[n - 1].y - (l + 1) * (o[n - 1].y - olast.y) / (num - 1);
            o[n + l].color = colors[num - 1];
            o[n + l].layer = num;

          }

          if (i < 6) {
            o[n + num - 2] = olast;
          }

        }

        points = points.concat(o)
      }

      function Draw() {
        for (var i = 1; i <= 6; i++) {
          layer(i, colors[i])
        }
        for (var i = 0; i < points.length; i++) {
          points[i].r1 = 2 * R / 3;
          points[i].aSin = 0;
          points[i].offset = 0;
          points[i].r = R - R / 5;
          hexagon(R, points[i]);
        }
      }

      Draw();

      function Update() {

        ctx.fillRect(0, 0, cw, ch)
        for (var i = 0; i < points.length; i++) {

          if (i == I) {
            iRy[0] = i;

            /*for(var k = 5; k > 0; k--){
                
              if(I < points.length -k){
                for(j = 1; j <= k; j++){
                  if(j == k+1 && iRy[k+1]){iRy[j] = 0;
                  }else{iRy[j] = iRy[j-1]+1;}
                }
              }
            }*/

            if (I < points.length - 6) {
              for (j = 1; j <= 6; j++) {
                if (j == 6 + 1) {
                  iRy[j] = 0;
                } else {
                  iRy[j] = iRy[j - 1] + 1;
                }
              }

            } else if (I < points.length - 5) {
              for (j = 1; j <= 6; j++) {
                if (j == 5 + 1) {
                  iRy[j] = 0;
                } else {
                  iRy[j] = iRy[j - 1] + 1;
                }
              }

            } else if (I < points.length - 4) {
              for (j = 1; j <= 6; j++) {
                if (j == 4 + 1) {
                  iRy[j] = 0;
                } else {
                  iRy[j] = iRy[j - 1] + 1;
                }
              }

            } else if (I < points.length - 3) {
              for (j = 1; j <= 6; j++) {
                if (j == 3 + 1) {
                  iRy[j] = 0;
                } else {
                  iRy[j] = iRy[j - 1] + 1;
                }
              }

            } else if (I < points.length - 2) {
              for (j = 1; j <= 6; j++) {
                if (j == 2 + 1) {
                  iRy[j] = 0;
                } else {
                  iRy[j] = iRy[j - 1] + 1;
                }
              }

            } else if (I < points.length - 1) {
              for (j = 1; j <= 6; j++) {
                if (j == 1 + 1) {
                  iRy[j] = 0;
                } else {
                  iRy[j] = iRy[j - 1] + 1;
                }
              }
            }

            if (points[i].offset < 2 * Math.PI) {
              animateHexagon(points[iRy[0]])
            }

            for (var k = 1; k <= 6; k++) {
              if (points[i].offset >= k * Math.PI / 3) {
                animateHexagon(points[iRy[k]])
              }
            }

            if (points[i].offset >= 2 * Math.PI) {
              points[i].offset = 0;
              points[i].r = R - R / 5;
              I++;
            }
          }
          hexagon(R, points[i]);

        }

        if (I == points.length) {
          I = 0
        }

        requestId = window.requestAnimationFrame(Update)
      }

      requestId = window.requestAnimationFrame(Update)

      function animateHexagon(c) {
        c.r = r1 + Math.sin(c.aSin) * amplitude;
        c.aSin += speed;
        c.offset += speed;
      }
    },
    bgpos: function() {
      var c = $('canvas');
      if (c.length > 0) {
        var win = $(window);
        var w = win.width();
        var h = win.height();
        var cw = c.width();
        var ch = c.height();
        var mtop = (h - ch) / 2;
        var mleft = (w - cw) / 2;
        c.css({
          'margin-top': mtop,
          'margin-left': mleft
        });
      }
    },
    resize: (function() {
      $(window).resize(function(){
        yeehow.bgpos();
      });
    })(),
  };
});


