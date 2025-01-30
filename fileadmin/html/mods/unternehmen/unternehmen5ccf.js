$(document).ready(function(){
/* Viewportchecker
================================================== */
  $('.e-fadeInUp').addClass("hidden-o").viewportChecker({
      classToAdd: 'animated a-fadeInUp', // Class to add to the elements when they are visible
      offset: 50,
     });
  $('.video-fadeInUp').addClass("hidden-o").viewportChecker({
      classToAdd: 'animated v-fadeInUp', // Class to add to the elements when they are visible
      offset: 50,
     });
/* Image Flip
================================================== */
    var degreeRotateZ = 0;
    var degreeFlipX = 0;
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $('.i-rotateIn').click(function() {
      degreeRotateZ += -180;
      degreeFlipX += 180;
      $('.co-flip-icon').css('transform','rotate(' + degreeRotateZ + 'deg');
      $('.co-image-flip img').css('transform', 'perspective(1000px) rotateX(' +degreeFlipX+'deg)');
    });
/* slick slider image
================================================== */
$('.slick-images').slick({
  dots: false,
  arrows: false,
  fade: true,
  autoplay: true,
  autoplaySpeed: 2000,
  pauseOnHover: false,
  infinite: true,
  speed: 3000,

});
/* slick slider logos
================================================== */
$('.co-slick-logos').slick({
  dots: false,
  infinite: true,
  arrows: true,
  speed: 300,

  slidesToShow: 10,
  responsive: [
  { 
    breakpoint: 1280,
    settings: {
      slidesToShow: 6,
      slidesToScroll: 1,
      infinite: true,
    }
  },
    { 
    breakpoint: 768,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
    }
  }

  ]
});
/* counter animation
================================================== */
$('.counter-con').viewportChecker({
  offset: 50,
  callbackFunction: function(elem, action){
    var $counterElem = $(elem).find('.counter');
    var countTo = $counterElem.attr('data-count');
    $({ countNum: $counterElem.text()}).animate({
      countNum: countTo
    },
    {
      duration: 5000,
      easing:'linear',
      step: function(now) {
        $counterElem.text(dotSeparateNumber(Math.floor(this.countNum)));
      },
      complete: function() {
        $counterElem.text(dotSeparateNumber(this.countNum));
      }
    });  
  //Dotseperator
  function dotSeparateNumber(val) {
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+'.'+'$2');
    }
    return val;
  }
  },
});

/* Driver Icons Counter Animation
================================================== */
  var iconsDriverCount = 1;
  $('.count-icon-persons').viewportChecker({
      offset: 50,
      callbackFunction: function iconsDriverLoop(elem, action){
        if (iconsDriverCount < 11) {
          var iconDriver = $('#icon-driver-' + iconsDriverCount);
          iconDriver.addClass('icon-driver');
          iconsDriverCount++;
          setTimeout(iconsDriverLoop, 500);
        }
      },
  });
  
  $('.co-video-deskpad').viewportChecker({
      offset: -50,
      callbackFunction: function (elem, action){
        //Video Schlusssequenz autoplay
        // console.log(99);
        $('#schlusssequenz')[0].play();
      },
  });
  


});