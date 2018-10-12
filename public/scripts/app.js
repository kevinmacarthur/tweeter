/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 $(document).ready(function() {

  postTweet();
  loadTweets();
  composeTweet();
});

// Loads all the tweets in database
  function loadTweets () {
    $.getJSON('/tweets/').done(renderTweets);
  }

//Creates a new tweet
function createTweetElement(element) {

  var time = Math.round((Date.now() - element.created_at) / (1000*3600*24));
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
              <i class="icon ion-md-flag"></i>
              <i class="icon ion-md-repeat"></i>
              <button class="liked" name="${element._id}"><i class="icon ion-md-heart"></i></button>
              <span class="likes-count"> ${element.likes} </span>
            </div>
          </footer>
        </article>
  `;
  return newElement;
}


function renderTweets (data) {
  $('#tweets-container').empty();
  for (var tweet of data) {
    var $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);    //places tweet at top instead of append
  }
  attachListeners()
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
    let tweet = $(this).children('.tweet-text').val();
    const safeHTML = escape(tweet); //Creates safe html from form input
    $(this).children('.tweet-text').val(safeHTML);  //Injects Safe text back into textbox input to serialize
    let newTweet = $(this).serialize();
    let counter = Number($(this).children('.counter').text());
    if (counter === 140) {
      $('#error-message').slideUp("fast", function() {});
      setTimeout(function(){$('#error-message').text("Error: Tweet is empty");}, 300)
      $('#error-message').slideDown("slow", function() {});
    } else if (counter < 0) {
      $('#error-message').slideUp("fast", function() {});
      setTimeout(function(){$('#error-message').text("Error:Exceded Character Limit");}, 300)
      $('#error-message').slideDown("slow", function() {});
    } else {
      $.post('/tweets/', newTweet);
      $('#error-message').slideUp("slow", function() {});
      setTimeout(function(){loadTweets();}, 200); ///accounts for built in server delay
      $form.trigger("reset");
      $(this).children('.counter').text(140);
    }
  });
}

//THIS is what happens when a user Clicks compose button
function composeTweet() {
  let $button = $('#compose');
  let clicked = false;
  $button.on('click', function () {
    if (clicked === false) {
      $('#new-tweet-container').slideUp("fast", function() {
        clicked = true;
      });
    } else {
      $('#new-tweet-container').slideDown("fast", function() {
        clicked = false;
        let $textArea = $("#tweet-form .tweet-text");
        $textArea.select();
      });
    }
  });
}

//BUG FIX NEED to tie the true and false to just that element
//if i click different tweets it breaks
function attachListeners() {
  let liked = false
  $(".liked").on('click', function(){
    let tweetId = $(this).attr("name")
    let $counter = ($(this).siblings('.likes-count'))
    let currentLikes = Number($counter.text())
    if (liked===false || currentLikes === 0) {
      $counter.text(currentLikes + 1);
      currentLikes += 1;  // makes currentlikes the correct value to send in ajax
      liked = true;
      $(this).css('color', 'red')
        //Send Ajax Put Request to update db here for counter text as # of likes
        $.ajax({
          url: `/tweets/${tweetId}`,
          type: `PUT`,
          data:{
                tweetId: `${tweetId}`,
                currentLikes: currentLikes
              },
          success: function(result) {
            console.log("Ajax sent successfully")
          }
        });
    } else {
      $counter.text(currentLikes - 1);
      currentLikes -= 1;
      liked = false;
      $(this).css('color', 'gray') //change red to like a duller red / default color
        $.ajax({
          url: `/tweets/${tweetId}`,
          type: `PUT`,
          data:{
                tweetId: `${tweetId}`,
                currentLikes: currentLikes
              },
          success: function(result) {
            console.log("Ajax sent successfully")
          }
        });
    }
  });
}




