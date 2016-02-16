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

      el.page.eq(current).addClass('page-show').css({
        opacity: 1
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
        go('next');
      });
      el.page.on('swipedown',function(e,data){
        go('prev');
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

        el.page.eq(next).addClass('page-show');

        TweenMax.fromTo(el.page.eq(current), 1, {
          opacity: 1,
          scale: 1
        }, {
          opacity: 0,
          scale: 0.8
        });

        TweenMax.fromTo(el.page.eq(next), 1, {
          opacity: 1,
          top: toppos
        }, {
          top: 0
        });
        current = next;
      };

      var reset = function() {
        el.page.attr('class', 'page').removeAttr('style');
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
      window.addEventListener("mousemove", touches);
      window.addEventListener("touchstart", touches);
      window.addEventListener("touchmove", touches);
    })(),
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