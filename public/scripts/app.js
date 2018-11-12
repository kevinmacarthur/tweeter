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

// Loads all the tweets in database and then renders them
function loadTweets () {
  $.getJSON('/tweets/').done(renderTweets);
}

function checkTimeAgo (timeAgo) {
  //Gets Days ago
  let time = Math.floor((Date.now() - timeAgo) / (1000*60*60*24))
  let fullTime = `${time} day`
  if (time < 1) {
    //Hours ago
    time = Math.floor((Date.now() - timeAgo) / (1000*60*60))
    fullTime = `${time} hour`
    if (time < 1) {
      //Minutes ago
      time = Math.floor((Date.now() - timeAgo) / (1000*60))
      fullTime = `${time} minute`
      if (time < 1) {
        //Seconds ago
        time = Math.floor((Date.now() - timeAgo) / 1000)
        fullTime = `${time} second`
      }
    }
  }
  if (time !== 1) {
    fullTime = fullTime + "s"
  }
  return fullTime
}

//Creates a new tweet using tweet information submitted
function createTweetElement(element) {

  let time = checkTimeAgo(element.created_at)
  let newElement = `
    <article class="tweet">
          <header>
            <img class="avatar" src=${element.user.avatars.small}>
            <strong>${element.user.name} </strong>
            <span> ${element.user.handle}</span>
          </header>
          <p>${element.content.text}</p>
          <footer>
            ${time} ago
            <div class="images">
              <span class="status" data-liked-status="notLiked"></span>
              <button class="delete" name="${element._id}"><i class="icon ion-md-trash"></i></button>
              <button class="liked" name="${element._id}"><i class="icon ion-md-heart"></i></button>
              <span class="likes-count"> ${element.likes} </span>
            </div>
          </footer>
        </article>
  `;
  return newElement;
}

//Clears all the tweets and then recreates tweets with newest at top
//Also attaches event listeners after the tweets have rendered
function renderTweets (data) {
  $('#tweets-container').empty();
  for (let tweet of data) {
    let $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet);
  }
  attachLikes()
  attachDelete()
}

//Cleans text to avoid Cross-Site Scripting in entered Tweets
function escape(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

//Posts a tweet if it matches character length requirements
function postTweet(){
  let $form = $('#tweet-form');
  $form.on('submit', function (event) {
    event.preventDefault();
    let tweet = $(this).children('.tweet-text').val();

    const safeHTML = escape(tweet); //Creates safe html from form input
    $(this).children('.tweet-text').val(safeHTML);  //Injects Safe text back into textbox input to serialize

    let newTweet = $(this).serialize();
    let counter = Number($(this).children('.counter').text());

    if (counter === 140) {
      $('#error-message').slideUp('fast', function() {});
      setTimeout(function(){$('#error-message').text('Error: Tweet is empty');}, 300)
      $('#error-message').slideDown("slow", function() {});

    } else if (counter < 0) {
      $('#error-message').slideUp('fast', function() {});
      setTimeout(function(){$('#error-message').text('Error:Exceded Character Limit');}, 300)
      $('#error-message').slideDown("slow", function() {});

    } else {
      $.post('/tweets/', newTweet);
      $('#error-message').slideUp('slow', function() {});
      setTimeout(function(){loadTweets();}, 200);
      $form.trigger('reset');
      $(this).children('.counter').text(140);
    }
  });
}

//When a user Clicks compose button on webPage
function composeTweet() {
  let $button = $('#compose');
  let clicked = false;

  $button.on('click', function () {
    if (!clicked) {
      $('#new-tweet-container').slideUp('fast', function() {
        clicked = true;
      });

    } else {
      $('#new-tweet-container').slideDown('fast', function() {
        clicked = false;
        let $textArea = $('#tweet-form .tweet-text');
        $textArea.select();
      });
    }
  });
}

// Function attaches Event Listeners to the like button and sends Ajax Put request
function attachLikes() {
  $(".liked").on('click', function(){
    const status =($(this).siblings('.status'))
    const tweetId = $(this).attr('name')
    const $counter = ($(this).siblings('.likes-count'))
    let currentLikes = Number($counter.text())

    if (status.attr('liked-status')!=='Liked' || currentLikes === 0) {
      $counter.text(currentLikes + 1);
      currentLikes += 1;  // makes currentlikes the correct value to send in ajax
      status.attr('liked-status', 'Liked')      // flips status of liked
      $(this).css('color', 'red') //Changes heart to red
      //Sends Ajax Request
      $.ajax({
        url: `/tweets/${tweetId}`,
        type: `PUT`,
        data:{
          tweetId: `${tweetId}`,
          currentLikes: currentLikes
          },
      });
    } else {
      $counter.text(currentLikes - 1); // Changes like number on Webpage
      currentLikes -= 1;
      status.attr('liked-status', 'notLiked') // Flips status of liked back to notLiked to avoid multiple dislikes or likes during the same session
      $(this).css('color', '#244751')
      $.ajax({
        url: `/tweets/${tweetId}`,
        type: `PUT`,
        data:{
          tweetId: `${tweetId}`,
          currentLikes: currentLikes
        },
      });
    }
  });
}

//Function attaches an Event Listener to the Trash button and sends a delete request
function attachDelete() {
  $('.delete').on('click', function(){
    let tweetId = $(this).attr('name')
    $.ajax({
      url: `/tweets/${tweetId}`,
      type: `Delete`,
      data:{
        tweetId: `${tweetId}`,
      },
      success: function(result) {
        setTimeout(function(){loadTweets();}, 500);
      }
    });
  });
}
