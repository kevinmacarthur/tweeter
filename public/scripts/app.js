/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

  function loadTweets () {
    $.getJSON('/tweets/').done(renderTweets);
  }

$(document).ready(function() {

  postTweet()
  loadTweets();
  composeTweet()
})

//Creates a new tweet
function createTweetElement(element) {

  var time = Math.round((Date.now() - element.created_at) / (1000*3600*24))
  var newElement = `
    <article class="tweet">
          <header>
           <img class="avatar" src=${element.user.avatars.small}>
           <strong>${element.user.name} </strong>
          <span> ${element.user.handle}</span>
          </header>
          <p>${element.content.text}</p>
          <footer>
            ${time} days ago
          <div class="images">
            <i class="icon ion-md-heart"></i>
            <i class="icon ion-md-flag"></i>
            <i class="icon ion-md-repeat"></i>
          </div>
          </footer>
        </article>
  `
  return newElement
}


function renderTweets (data) {
  $('#tweets-container').empty()
  for (var tweet of data) {
    var $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);    //places tweet at top instead of append
  }
}

//THIS Cleans text to avoid javascript being injected
function escape(str) {
  var div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//HOW TO POST A TWEET

function postTweet(){
  var $form = $('#tweet-form');

  $form.on('submit', function (event) {
    event.preventDefault();
    let tweet = $(this).children('.tweet-text').val()
    const safeHTML = escape(tweet)
    let safeTweet = $(this).children('.tweet-text').val(safeHTML)
    let newTweet = $(this).serialize();

    let counter = Number($(this).children('.counter').text());
    if (counter === 140) {
      $('#error-message').text("Error: Tweet is empty");
      $('#error-message').slideDown("slow", function() {})
    } else if (counter < 0) {
      $('#error-message').text("Error: Exceded Character Limit");
      $('#error-message').slideDown("slow", function() {})
    } else {
      $.post('/tweets/', newTweet)
      // .done(loadTweets());    Old version
      $('#error-message').slideUp("slow", function() {})
      setTimeout(function(){loadTweets()}, 200); ///accounts for built in server delay
      $form.trigger("reset");
      $(this).children('.counter').text(140);
    }
  });
};

//THIS is what happens when a user Clicks compose button
function composeTweet() {
  let $button = $('#compose');
  let clicked = false
  $button.on('click', function () {
    if (clicked === false) {
      $('#new-tweet-container').slideUp("fast", function() {
        clicked = true;
      })
    } else {
      $('#new-tweet-container').slideDown("fast", function() {
        clicked = false;
        let $textArea = $("#tweet-form .tweet-text")
        console.log($textArea)
        $textArea.select()
      });
    };
  });
}

