"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");


// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet)
      callback(null, true)
    },


    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
        db.collection("tweets").find().toArray(callback)   //makes all tweets in database into an array
      }

      // Use this helper function to access the db and update the tweet
      //Need to find where to use it
    //  updateLikes: function(Tweet, callback) {
    //   db.collection("tweets").updatetOne(Tweet) //use the sent id to update the tweet
    //   callback(null, true)
    // },
  }
}
