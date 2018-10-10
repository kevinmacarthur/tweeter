/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// THIS IS WHAT TWEET OBJECT LOOKS LIKE

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
  for (var tweet of data) {
    var $tweet = createTweetElement(tweet);
    $('#tweets-container').append($tweet);
  }
}

$(document).ready(function() {

  function loadTweets () {
    $.getJSON('/tweets/').done(renderTweets);
  }

  postTweet();
  loadTweets();
})

function postTweet(){
  var $form = $('#tweet-form');
  $form.on('submit', function (event) {
    event.preventDefault();
    let newTweet = $(this).serialize();
    $.post('/tweets/', newTweet)
  });
};

