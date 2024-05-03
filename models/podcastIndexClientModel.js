const mongoose = require("mongoose");

const { Schema } = mongoose;

//const {podcastIndexClient} = mongoose;

const podcastIndexClient = new Schema({
    _id: {
        type: String
    },
    name: {
        type: String
    },
    date: {
        type: Number
    },
    key: {
        type: String
    },
    secret: {
        type: String
    },
    // opt-out of analytics collection
    disableAnalytics:  {
        type: Boolean
    }
});

const PodcastModel = mongoose.model("PodcastModel", podcastIndexClient)

module.exports = PodcastModel;