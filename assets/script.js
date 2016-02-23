$(function(){
  var el = {
    desc: $('.desc'),
    descClose: $('.desc-close'),
    page: $('.page'),
    link: $('.link a'),
  };
  var fn = {
    pageTransition: (function() {
      var len = el.page.length;
      var current = 0;
      var next = 1;

      el.page.eq(current).addClass('page-current').css({
        //opacity: 1,
        top: 0
      });

      el.page.bind('mousewheel DOMMouseScroll', debounce(function(e) {
        if ($(e.target).closest('.desc').length === 0) {
          if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
            go('next');
          } else {
            go('prev');
          }
        }
        e.preventDefault();
      }, 200, false));

      $(document).keydown(function(e) {
        switch(e.which) {
          case 38: // up
            go('next');
            break;
          case 40: // down
            go('down');
            break;

          default: return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
      });

      el.page.on('swipeup',function(e,data){
        go('prev');
      });
      el.page.on('swipedown',function(e,data){
        go('next');
      });

      var go = function(direction) {
        reset();
        fn.descOff();

        var toppos = 3000;

        if (direction === 'next') {
          next = (current - 1) >= 0 ? (current - 1) : len - 1;
          toppos = -3000;
        } else {
          next = (current + 1) < len ? (current + 1) : 0;
        }

        el.page.eq(current).addClass('page-prev');
        el.page.eq(next).addClass('page-current');

        TweenMax.fromTo(el.page.eq(current), 1, {
          //opacity: 1,
          scale: 1,
        }, {
          //opacity: 0,
          scale: 0.8,
        });

        TweenMax.fromTo(el.page.eq(next), 1, {
          //opacity: 1,
          top: toppos
        }, {
          top: 0
        });
        current = next;
        switch(current+1) {
          // case 1:
          //   yeehow.fxParallax($('#page1 .bg'));
          //   break;
          case 2:
            fn.page2();
            break;
          case 3:
            fn.page3();
            break;
          case 4:
            fn.page4();
            break;
          case 5:
            fn.page5();
            break;
        }
      };

      var reset = function() {
        el.page.attr('class', 'page').removeAttr('style');
        $('#page2 .clone').remove();
      };

      function debounce(func, wait, immediate) {
        var timeout;
        return function() {
          var context = this,
            args = arguments;
          var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        }
      };
    })(),
    page1: (function() {
      var touches = function(e) {
        var x = e.touches ? e.touches[0].clientX : e.clientX, 
            y = e.touches ? e.touches[0].clientY : e.clientY;
        
        var w = window.innerWidth / 2;
        var h = window.innerHeight / 2;
        
        var l = -(x - w) / (w / 10) - 10;
        var t = -(y - h) / (h / 10) - 10;
        
        TweenMax.to($('#page1 .bg'), 1, {
          top: t + "%",
          left: l + "%"
        });
      }
      $('#page1').bind('mousemove touchstart touchmove', touches);
      // $('#page1').addEventListener("mousemove", touches);
      // $('#page1').addEventListener("touchstart", touches);
      // $('#page1').addEventListener("touchmove", touches);
    })(),
    page2: function() {
      var depth = 50;
      var clone = $($('#page2 .bg').html().replace('svg-container', 'svg-container clone'));
      // var shadow = $('<div class="shadow"></div>');

      // shadow.appendTo('#page2 .bg');

      for (var i = 1; i <= depth; i++) {
        var d = i * 0.05;

        clone.clone().appendTo($('#page2 .bg'))
          .css({
            'margin-top': i,
            'margin-left': depth - i,
            'z-index': depth - i
          })
        TweenMax.from($('#page2 .clone').eq(i-1), 2, {autoAlpha: 0, delay: d});
      }
    },
    page3: function() {
      fn.anibg($('#page3 .drawsvg'));
    },
    page4: function() {
      fn.anibg($('#page4 .drawsvg'));
    },
    anibg: function(el) {
      var svg = el.drawsvg({
        duration: 4000,
        stagger: 2000,
      });
      svg.drawsvg('animate');
    },
    page5: function() {
      var colorlist = ['#8b026f', '#9c2684', '#9e418b', '#a15391', '#a66699'];
      function random(min, max){
        return (Math.random() * (max - min)) + min;
      }

      $('#page5 .bg').append('<div id="page5_bubble"></div>');

      for (var i=0; i<100; i++) {
        var size = random(20, 40).toFixed();
        var alpha = random(0.3, 0.6).toFixed(1);
        var color = random(0, 4).toFixed();
        var bubble = $('<div class="bubble"></div>')
        var w = window.innerWidth;
        var h = window.innerHeight;
        var x = random(0, w),
            y = random(0, h),
            z = random(-1000, -200);

        bubble.appendTo('#page5_bubble').css({
          'height': size,
          'width': size,
          'background-color': colorlist[color]
        })
        TweenMax.fromTo(bubble, 3, {
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
        
        TweenMax.to($('#page5_bubble'), 1, {
          webkitPerspectiveOrigin: x + "px " + y +"px",
          perspectiveOrigin: x + "px " + y +"px"
        });
        
      }

      $('#page5_bubble').bind('mousemove touchstart touchmove', touches);
    },
    desc: (function() {
      el.link.click(function(){
        var t = $(this);

        fn.descOff();

        // activate
        t.addClass('active');
        t.parents('.page').addClass('page-desc');
        $(t.attr('href')).addClass('active');
        el.descClose.addClass('active');

        $(document).click(function(e) {
          var t = $(e.target);
          if (t.closest('.link').length === 0 && t.closest('.desc').length === 0) {
            fn.descOff();
          }
        });
      });

      el.descClose.click(function() {
        fn.descOff();
      });

    })(),
    descOff: function() {
      el.page.removeClass('page-desc');
      el.link.removeClass('active');
      el.desc.removeClass('active');
      el.descClose.removeClass('active');
    },
  }
});