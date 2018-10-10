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
renderTweets(data)
})



const data = [
  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1461113959088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461113796368
  }
];


$(function(){
  var $form = $('#tweet-form');
  $form.on('submit', function (event) {
    event.preventDefault();
    let newTweet = $(this).serialize()
    $.post('/tweets/', newTweet)
      });
  });

