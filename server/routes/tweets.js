"use strict";

const userHelper    = require("../lib/util/user-helper")

const express       = require('express');
const tweetsRoutes  = express.Router();


module.exports = function(DataHelpers) {

  tweetsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, tweets) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(tweets);
      }
    });
  });

  tweetsRoutes.post("/", function(req, res) {
    if (!req.body.text) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    const user = req.body.user ? req.body.user : userHelper.generateRandomUser();
    const tweet = {
      user: user,
      content: {
        text: req.body.text
      },
      created_at: Date.now(),
      likes: 0
    };

    DataHelpers.saveTweet(tweet, (err) => {
      if (err) {
        res.status(500).json({ error: "err.message" });
      } else {
        res.status(201).send();
      }
    });
  });


// THIS IS TEST CODE TO MAKE PUT REQUEST TO LIKE BUTTON
  tweetsRoutes.put("/:id", function(req, res) {
    let tweetId = req.body.tweetId;
    let likes = req.body.currentLikes
    console.log(tweetId)
    console.log(likes)
    res.status(201).send();
  })
      //   const filter =
      //   // We need to find the current value of liked first
      //   db.collection('tweets').findOne(filter, (err, tweet) => {
      //     // Flip completion
      //     const liked = !tweet.liked
      //     // Now we update database with new status of liked
      //     db.collection('tweets').updateOne(
      //       // Yes, a callback inside a callback.
      //       filter, // TODO: reimplement this with promises!
      //       { $set: { liked: liked } },
      //       (err, result) => {
      //         if (err) {
      //           res.send('Something exploded on PUT')
      //           return
      //         }
      //         res.redirect('/')
      //       }
      //     )
        // })
//       });

  return tweetsRoutes;

}
