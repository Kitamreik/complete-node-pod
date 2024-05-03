const { v4: uuidv4 } = require('uuid');
const siteData = [
    {
        _id: uuidv4(),
        name: "Test Entry",
        date: Date.now(),
        key: process.env.PODCAST_API_KEY, //won't render in the JSON message for index BUT will for creating 
        secret: process.env.PODCAST_API_SECRET, //won't render in the JSON message for index BUT will for creating 
        disableAnalytics: true
    }
]

module.exports = siteData;