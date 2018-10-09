$(document).ready(function() {
  console.log("Document is Ready!")
});

$('.new-tweet textarea').bind("keyup", function (event) {
  let textbox = $(this).val();
  let counter = $(this).siblings('.counter');
  counter.text(140 - textbox.length)
  if (textbox.length > 140) {
    counter.css('color', 'red');
  } else {
    counter.css('color', 'black');
  }
});
