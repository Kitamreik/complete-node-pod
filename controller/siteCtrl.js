const { v4: uuidv4 } = require('uuid');
const PodcastModel = require('../models/podcastIndexClientModel')

//mimics a Create Operation
const foo = async(req, res, next) => {
    let error = "Server crashed early."
    /*
    //https://www.npmjs.com/package/podcast-index-api
    //const api = require('podcast-index-api')(process.env.PODCAST_API_KEY, process.env.PODCAST_API_SECRET) //Error: API Key and Secret are required from https://api.podcastindex.org/, refuses the env method
    */
    // ======== Required values ======== 
    // WARNING: don't publish these to public repositories or in public places!
    // NOTE: values below are sample values, to get your own values go to https://api.podcastindex.org 
    
    //manually define the key and secret in strings.
    let key = "";
    let secret = "";

    // res.json("Api route functional") //success
    const api = require('podcast-index-api')(key, secret)
    //console.log(api)
    /*
    {
  api: [Function: got] {
    extend: [Function (anonymous)],
    paginate: <ref *1> [AsyncGeneratorFunction: paginateEach] {
      all: [AsyncFunction (anonymous)],
      each: [Circular *1]
    },
    stream: [Function (anonymous)] {
      get: [Function (anonymous)],
      post: [Function (anonymous)],
      put: [Function (anonymous)],
      patch: [Function (anonymous)],
      head: [Function (anonymous)],
      delete: [Function (anonymous)]
    },
    get: [Function (anonymous)],
    post: [Function (anonymous)],
    put: [Function (anonymous)],
    patch: [Function (anonymous)],
    head: [Function (anonymous)],
    delete: [Function (anonymous)],
    RequestError: [class RequestError extends Error],
    CacheError: [class CacheError extends RequestError],
    ReadError: [class ReadError extends RequestError],
    HTTPError: [class HTTPError extends RequestError],
    MaxRedirectsError: [class MaxRedirectsError extends RequestError],
    TimeoutError: [class TimeoutError extends RequestError],
    ParseError: [class ParseError extends RequestError],
    CancelError: [class CancelError extends RequestError],
    UnsupportedProtocolError: [class UnsupportedProtocolError extends RequestError],
    UploadError: [class UploadError extends RequestError],
    defaults: {
      options: [Object],
      handlers: [Array],
      mutableDefaults: false,
      _rawHandlers: [Array]
    },
    mergeOptions: [Function: mergeOptions]
  },
  custom: [AsyncFunction: custom],
  searchByTerm: [AsyncFunction: searchByTerm],
  searchByTitle: [AsyncFunction: searchByTitle],
  searchEpisodesByPerson: [AsyncFunction: searchEpisodesByPerson],
  podcastsByFeedUrl: [AsyncFunction: podcastsByFeedUrl],
  podcastsByFeedId: [AsyncFunction: podcastsByFeedId],
  podcastsByFeedItunesId: [AsyncFunction: podcastsByFeedItunesId],
  podcastsByGUID: [AsyncFunction: podcastsByGUID],
  podcastsByTag: [AsyncFunction: podcastsByTag],
  podcastsTrending: [AsyncFunction: podcastsTrending],
  podcastsDead: [AsyncFunction: podcastsDead],
  addByFeedUrl: [AsyncFunction: addByFeedUrl],
  addByItunesId: [AsyncFunction: addByItunesId],
  episodesByFeedId: [AsyncFunction: episodesByFeedId],
  episodesByFeedUrl: [AsyncFunction: episodesByFeedUrl],
  episodesByItunesId: [AsyncFunction: episodesByItunesId],
  episodesById: [AsyncFunction: episodesById],
  episodesRandom: [AsyncFunction: episodesRandom],
  recentFeeds: [AsyncFunction: recentFeeds],
  recentEpisodes: [AsyncFunction: recentEpisodes],
  recentNewFeeds: [AsyncFunction: recentNewFeeds],
  recentSoundbites: [AsyncFunction: recentSoundbites],
  valueByFeedId: [AsyncFunction: valueByFeedId],
  valueByFeedUrl: [AsyncFunction: valueByFeedUrl],
  categoriesList: [AsyncFunction: categoriesList],
  hubPubNotifyById: [AsyncFunction: hubPubNotifyById],
  hubPubNotifyByUrl: [AsyncFunction: hubPubNotifyByUrl]
}
    */
    //success
  
    const results = await api.searchByTerm('')  //log results...

    api.searchByTerm('').then(results => { console.log("If searching by term, the result of the search query is:", results ) }) //results is empty, hence {}
    api.custom('').then(results => { console.log("If searching via the custom line, the result of the search query is:", results ) }) //works for empty strings

    //Functions from Documentation
    /*
    Custom
    Use for endpoints that don't have a specific function or if the function doesn't accept an argument for a desired parameter.
    custom(path: String, queries: Object)
    Search
    searchByTerm(q: String, val: String, clean: Boolean, fullText: Boolean)
    searchByTitle(q: String, val: String, clean: Boolean, fullText: Boolean)
    searchEpisodesByPerson(q: String, fullText: Boolean)
    Podcasts
    podcastsByFeedUrl(feedUrl: String)
    podcastsByFeedId(feedId: Number)
    podcastsByFeedItunesId(itunesId: Number)
    podcastsByGUID(guid: Number)
    podcastsByTag()
    podcastsTrending(max: Number, since: Number, lang: String, cat: String, notcat: String)
    podcastsDead()
    Episodes
    episodesByFeedId(feedId: Number, since: Number, max: Number, fullText: Boolean)
    episodesByFeedUrl(feedUrl: String, since: Number, max: Number, fullText: Boolean)
    episodesByItunesId(itunesId: Number, since: Number, max: Number, fullText: Boolean)
    episodesById(id: Number, fullText: Boolean)
    episodesRandom(max: Number, lang: String, cat: String, notcat: String, fullText: Boolean)
    Recent
    recentFeeds(max: Number, since: Number, cat: String, lang: String, notcat: String)
    recentEpisodes(max: Number, excludeString: String, before: Number, fullText: Boolean)
    recentNewFeeds(max: Number, since: Number)
    recentSoundbites(max: Number)
    Value
    valueByFeedUrl(feedUrl: String)
    valueByFeedId(feedId: Number)
    Categories
    categoriesList()
    Notify Hub
    hubPubNotifyById(feedId: Number)
    hubPubNotifyByUrl(feedUrl: string)
    Add
    addByFeedUrl(feedUrl: String, chash: String, itunesId: Number)
    addByItunesId(itunesId: Number)
    */

    // assumes you have an your key and secret set as environment variables
    //Kit: refuses the env method
    /*
    const client = new PodcastIndexClient({
        key: key,
        secret: secret,
        // opt-out of analytics collection
        disableAnalytics: true,
    });
    */
    
    const {name, date} = req.body;
    console.log(req.body)

    const newPodcastModel = new PodcastModel({
        //adding _id parameter due to error log
        _id: uuidv4(),
        name: name,
        date: date,
        //key: key, 
        //will render for creating a model on the "/test" route
        //secret: secret, 
        //will render for creating a model on the "/test" route
        // opt-out of analytics collection
        disableAnalytics: true,
    })

    //this must be here so the model is saved
    newPodcastModel.save();
    console.log(newPodcastModel, "New Podcast model triggered after saving") //success

    try {
        await console.log("Client detected, await triggered"); //success

        //OG code causing crashes
        /*
        await newPodcastModel.search("javascript").then(console.log("Client detected, await triggered"));
        newPodcastModel.search().recentFeeds().then(console.log);
        newPodcastModel.search().recentNewFeeds().then(console.log);
        newPodcastModel.search().recentEpisodes().then(console.log);

        newPodcastModel.search().podcastByUrl("https://feeds.theincomparable.com/batmanuniversity").then(console.log);
        newPodcastModel.search().podcastById(75075).then(console.log);
        newPodcastModel.search().podcastByItunesId(1441923632).then(console.log);

        newPodcastModel.search().episodesByFeedUrl("https://feeds.theincomparable.com/batmanuniversity").then(console.log);
        newPodcastModel.search().episodesByFeedId(75075).then(console.log);
        newPodcastModel.search().episodesByItunesId(1441923632).then(console.log);
        newPodcastModel.search().episodeById(16795106).then(console.log);

        */
        
        res.status(200).json({ success: "A new podcast is created", data: newPodcastModel, statusCode: 200 }); //success

    } catch (error) { //error handling success
        res.status(400).json({ error: "Something happened while creating a podcast", data: error, statusCode: 400 });

        //error logs - resolved in newPodcastModel
        /*
        callback(new MongooseError('document must have an _id before saving'));
        ^

        MongooseError: document must have an _id before saving
        */
    }
}

module.exports = foo;