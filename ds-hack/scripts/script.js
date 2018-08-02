// setTimeout(function () {
//   $('#finger img').show()
// }, 500);

// Hand following mouse
$(document).bind('mousemove', function (e) {
  $('#finger').css({
    left: e.pageX - 670, // Don't change this --> setting for full screen
    top: e.pageY - 110 // Don't change this --> setting for full screen
  });
  $('#ripple-bound').css({
    left: e.pageX - 610, // Don't change this --> setting for full screen
    top: e.pageY - 150 // Don't change this --> setting for full screen
  });
});

// Ripple effect
$("button").click(function (e) {

  // Remove any old one
  $(".ripple").remove();

  // Setup
  var posX = $(this).offset().left,
    posY = $(this).offset().top,
    buttonWidth = $(this).width(),
    buttonHeight = $(this).height();

  // Add the element
  $(this).prepend("<span class='ripple'></span>");


  // Make it round!
  if (buttonWidth >= buttonHeight) {
    buttonHeight = buttonWidth;
  } else {
    buttonWidth = buttonHeight;
  }

  // Get the center of the element
  var x = e.pageX - posX - buttonWidth / 2;
  var y = e.pageY - posY - buttonHeight / 2;


  // Add the ripples CSS and start the animation
  $(".ripple").css({
    width: buttonWidth,
    height: buttonHeight,
    top: y + 'px',
    left: x + 'px'
  }).addClass("rippleEffect");
});

$('.btn-skip').click(function(){
  setTimeout(function () {
    window.location.href = "eng-sign-in.html";
  }, 500);
});

$('.btn-client-id').click(function () {
  setTimeout(function () {
    window.location.href = "client-id.html";
  }, 500);
});

$('.btn-sign-in-confirm').click(function () {
  setTimeout(function () {
    window.location.href = "set-up-simple-login.html";
  }, 500);
});

$('.btn-setup-simple-login').click(function () {
  setTimeout(function () {
    window.location.href = "allow-face-id.html";
  }, 500);
});

$('.btn-allow-faceid').click(function () {
  setTimeout(function () {
    window.location.href = "face-id.html";
  }, 500);
});

$('.btn-faceid').click(function () {
  setTimeout(function () {
    window.location.href = "main-menu.html";
  }, 500);
});

$('.btn-view-accounts').click(function () {
  setTimeout(function () {
    window.location.href = "accounts.html";
  }, 500);
});

$('.btn-view-statements').click(function () {
  setTimeout(function () {
    window.location.href = "statements.html";
  }, 500);
});

$('.btn-transaction-account').click(function () {
  setTimeout(function () {
    window.location.href = "transaction-account.html";
  }, 500);
});

$('.btn-view-statement-page').click(function () {
  setTimeout(function () {
    window.location.href = "statement-page.html";
  }, 500);
});

$('.btn-pay-someone').click(function () {
  setTimeout(function () {
    window.location.href = "pay-someone.html";
  }, 500);
});

$('.btn-choose-annie').click(function () {
  setTimeout(function () {
    window.location.href = "annie-amount.html";
  }, 500);
});

$('.btn-annie-amount').click(function () {
  setTimeout(function () {
    window.location.href = "annie-next.html";
  }, 500);
});

$('.btn-annie-next').click(function () {
  setTimeout(function () {
    window.location.href = "annie-confirm.html";
  }, 500);
});