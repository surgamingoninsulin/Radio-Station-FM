$(document).ready(function () {
  var footer_height=$("#footer").height();
  $("#wrapper").css({
    'padding-bottom' : footer_height
  });
  $(".on").click(function () {
      $('.alert').css({
          'transform': 'translateX(0)',
      });
  });

  $(".close").click(function () {
      $('.alert').css({
          'transform': 'translateX(150%)',
      });
  });

  $(".out").click(function () {
      $('.alert').css({
          'transform': 'translateX(150%)',
      });
  })
})
