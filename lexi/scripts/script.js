$(document).ready(function () {
  // var TIMEOUT = 6000;

  // var interval = setInterval(handleNext, TIMEOUT);

  // Radio buttons
  function handleNext() {

    var $radios = $('input[class*="slide-radio"]');
    var $activeRadio = $('input[class*="slide-radio"]:checked');

    var currentIndex = $activeRadio.index();
    var radiosLength = $radios.length;

    $radios
      .attr('checked', false);


    if (currentIndex >= radiosLength - 1) {

      $radios
        .first()
        .attr('checked', true);

    } else {

      $activeRadio
        .next('input[class*="slide-radio"]')
        .attr('checked', true);


    }

  }

  // Slider navigation
  var $buttonPrev = $('.slider_prev');
  var $buttonNext = $('.slider_next');

  $buttonPrev.click(function () {
    var $radios = $('input[class*="slide-radio"]');
    var $activeRadio = $('input[class*="slide-radio"]:checked');

    var $audio = $('.audio__slide');
    var $activeAudio = $('.audio__slide.playing');


    var currentIndex = $activeRadio.index();
    var radiosLength = $radios.length;
    console.log('click prev')
    $radios
      .attr('checked', false);

    $audio.each(function(){
      $(this).removeClass('playing').get(0).pause();
      $audio[0].currentTime = 0;
      $audio[1].currentTime = 0;
      $audio[2].currentTime = 0;
      $audio[3].currentTime = 0;
      $audio[4].currentTime = 0;
    })

    if (currentIndex >= radiosLength - 1) {
      $radios
        .first()
        .attr('checked', true);

      $audio.currentTime = 0;
      setTimeout(function () {
        $audio
          .first().addClass('playing').get(0).play();
      }, 2000);

    } else {

      $activeRadio
        .prev('input[class*="slide-radio"]')
        .attr('checked', true);

      $activeAudio.currentTime = 0;
      setTimeout(function () {
        $activeAudio
          .prev().addClass('playing').get(0).play();
      }, 2000);
    }
  })

  $buttonNext.click(function () {
    var $radios = $('input[class*="slide-radio"]');
    var $activeRadio = $('input[class*="slide-radio"]:checked');

    var $audio = $('.audio__slide');
    var $activeAudio = $('.audio__slide.playing');

    var currentIndex = $activeRadio.index();
    var radiosLength = $radios.length;
    console.log('click next')
    $radios
      .attr('checked', false);

    $audio.each(function(){
      $(this).removeClass('playing').get(0).pause();
      $audio[0].currentTime = 0;
      $audio[1].currentTime = 0;
      $audio[2].currentTime = 0;
      $audio[3].currentTime = 0;
      $audio[4].currentTime = 0;
    })

    if (currentIndex >= radiosLength - 1) {
      $radios
        .first()
        .attr('checked', true);

      $audio.currentTime = 0;
      setTimeout(function () {
        $audio
          .first().addClass('playing').get(0).play();
      }, 2000);
    } else {

      $activeRadio
        .next('input[class*="slide-radio"]')
        .attr('checked', true);

      $activeAudio.currentTime = 0;
      setTimeout(function () {
        $activeAudio
          .next().addClass('playing').get(0).play();
      }, 2000);
    }
  })

  $('.play__presentation').click(function(){
    $(this).removeClass('play__overlay');
    var $audio = $('.audio__slide');
    var $music = $('.music');

    $music.get(0).play();

    setTimeout(function () {
      $audio
        .first().addClass('playing').get(0).play();

      var timeout1 = 17500;
      var timeout2 = 36500;
      var timeout3 = 41500;
      var timeout4 = 16500;
      var timeout5 = 44000;

      function clickNext() {
        $('.slider_next').trigger('click');
        console.log("click")
      }

      console.log('slide 1')

      setTimeout(function () {
        console.log('slide 2')
        clickNext()
        setTimeout(function () {
          console.log('slide 3')
          clickNext()
          setTimeout(function () {
            console.log('slide 4')
            clickNext()
            setTimeout(function () {
              console.log('slide 5')
              clickNext()
              setTimeout(function () {
              }, timeout5);
            }, timeout4);
          }, timeout3);
        }, timeout2);
      }, timeout1);


    }, 300);





    // var interval1 = setInterval(clickNext, timeout1);
    // var interval2 = setInterval(clickNext, timeout2);
    // var interval3 = setInterval(clickNext, timeout3);
    // var interval4 = setInterval(clickNext, timeout4);
    // var interval5 = setInterval(clickNext, timeout5);

  })



});
