const { v4: uuidv4 } = require('uuid');
const PodcastModel = require('../models/podcastIndexClientModel')

//Abort Controller: https://www.npmjs.com/package/abort-controller
//const abortController = require('abort-controller') //simple

// AbortController was added in node v14.17.0 globally
const AbortController = globalThis.AbortController || require('abort-controller') //upgraded
const control = new AbortController();
const signal = control.signal;

const timeout = setTimeout(() => {
	control.abort();
}, 150);

signal.addEventListener("abort", () => {
    console.log("Time out error: aborted!") //triggers whenever there is a server change, then the server console.logs get activated
    clearTimeout(timeout)//clean up the timeout function
})

//api data functionality
const bar = async(req, res, next) => {
    //Handling client and server errors: It is common to create a helper function to check that the response contains no client (4xx) or server (5xx) error responses:
    const checkStatus = response => {
        if (res.ok) { // response.status >= 200 && response.status < 300
            return res
        } else {
            console.log("Response check cleared through checkStatus handler");
        }
    }
    
    // ======== Required values ======== 
    // WARNING: don't publish these to public repositories or in public places!
    // NOTE: values below are sample values, to get your own values go to https://api.podcastindex.org 
     //manually define the key and secret in strings.
     let apiKey = "";
     let apiSecret = "";
    // ======== Hash them to get the Authorization token ======== 
    let crypto = require('crypto'); //This package is no longer supported. It's now a built-in Node module. If you've depended on crypto, you should switch to the one that's built-in. //Docs re: crypto - https://nodejs.org/docs/latest-v7.x/api/crypto.html#crypto_crypto

    //Determine if there is still crypto support or unavailable
    try {
        console.log('crypto support is enabled!'); //success
    } catch (err) {
        console.log('crypto support is disabled!');
    }

    let apiHeaderTime = Math.floor(Date.now()/1000); 
    console.log(`apiHeaderTime=[${apiHeaderTime}]`); //apiHeaderTime=[1714710175]
    
    let sha1Algorithm = "sha1"; 
    let sha1Hash = crypto.createHash(sha1Algorithm);
    console.log(sha1Hash)
    /*
    Hash {
    _options: undefined,
    [Symbol(kHandle)]: Hash {},
    [Symbol(kState)]: { [Symbol(kFinalized)]: false }
    }
    */
    let data4Hash = apiKey + apiSecret + apiHeaderTime;
    sha1Hash.update(data4Hash); 
    let hash4Header = sha1Hash.digest('hex'); 
    console.log(`hash4Header=[${hash4Header}]`); //hash4Header=[1b960a1861fbbd35a2a641399dc3c77ecb7a2add]

    // ======== Send the request and collect/show the results ======== 
    //fetch on GitHub: https://github.com/node-fetch/node-fetch
    //const fetch = require('node-fetch'); //Update code to use native Fetch, so this is deactivated. Run npm uninstall node-fetch

    let options = 
    {  method: "get",
    //body: JSON.stringify(body),
    headers: { 
        // not needed right now, maybe in future: 
        "Content-Type": "application/json", //uncommented for testing
        "X-Auth-Date": ""+apiHeaderTime,
        "X-Auth-Key": apiKey,
        "Authorization": hash4Header,
        "User-Agent": "SuperPodcastPlayer/1.8"
    },
    };
  
    res.json("Api route online"); //success
    let info = "";
    let response = await fetch("https://api.podcastindex.org/api/1.0/search/") //this lets us access the search feature

    //Handling client and server errors:
    try {
        checkStatus(response);
        console.log("Final Response check cleared, the resource is available. Cleaning up timeout function...")
        clearTimeout(timeout)//clean up the timeout function
    } catch (error) {
        console.log(error, "Response check error catching");
    }
    
    //OG: append the search query with the string we are searching
    let query = "bastiat"; 
    let url = "https://api.podcastindex.org/api/1.0/search/byterm?q="+query; 
    fetch(url, options)
    .then(res => res.json())
    //.then(json => { console.log(json); } ); //the console.log will print out this:
    /*
    {
    status: 'true',
    feeds: [
    {
        id: 96082,
        title: 'Sacred Sons Podcast',
        url: 'https://sacredsons.libsyn.com/sacredsonspodcast',
        originalUrl: 'https://sacredsons.libsyn.com/sacredsonspodcast',
        link: 'https://www.sacredsons.com/',
        description: 'Sacred Sons is an organization dedicated to Masculine Alchemy and Embodiment.  We utilize the power of ceremony, ritual, and intentional spaces to deepen into authentic brotherhood and catalyze growth in men worldwide.  Sacred Sons Co-founder Adam Jackson hosts weekly episodes where we dive deep into conversations with facilitators, musicians, athletes, artists, and influencers from around the world.',
        author: 'Adam Jackson, Aubert Bastiat, Jason MacKenzie',
        ownerName: 'Adam Jackson',
        image: 'https://static.libsyn.com/p/assets/c/5/a/4/c5a4ea135ba9a48de5bbc093207a2619/0001-2773510258081959412.jpg',
        artwork: 'https://static.libsyn.com/p/assets/c/5/a/4/c5a4ea135ba9a48de5bbc093207a2619/0001-2773510258081959412.jpg',
        lastUpdateTime: 1714528620,
        lastCrawlTime: 1714707980,
        lastParseTime: 1714528630,
        inPollingQueue: 0,
        priority: 3,
        lastGoodHttpStatusTime: 1714528611,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml; charset=utf-8',
        itunesId: 1482881607,
        generator: 'Libsyn WebEngine 2.0',
        language: 'en',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '9f5992ad-1d6a-5f1d-88cf-048428ef5398',
        medium: 'podcast',
        episodeCount: 180,
        imageUrlHash: 383056295,
        newestItemPubdate: 1714379100
    },
    {
        id: 1527628,
        title: 'Essays on Political Economy by Frederic Bastiat',
        url: 'http://www.loyalbooks.com/book/Political-Economy-Frederic-Bastiat/feed',
        originalUrl: 'http://www.loyalbooks.com/book/Political-Economy-Frederic-Bastiat/feed',
        link: 'http://www.loyalbooks.com/book/Political-Economy-Frederic-Bastiat',
        description: 'Bastiat asserted that the only purpose of government is to defend the right of an individual to life, liberty, and property. From this definition, Bastiat concluded that the law cannot defend life, liberty and property if it promotes socialist policies inherently opposed to these very things. In this way, he says, the law is perverted and turned against the thing it is supposed to defend.',
        author: 'Loyal Books',
        ownerName: 'Loyal Books',
        image: 'http://www.loyalbooks.com/image/feed/Political-Economy-Frederic-Bastiat.jpg',
        artwork: 'http://www.loyalbooks.com/image/feed/Political-Economy-Frederic-Bastiat.jpg',
        lastUpdateTime: 1702293399,
        lastCrawlTime: 1702293397,
        lastParseTime: 1702293400,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1702293397,
        lastHttpStatus: 200,
        contentType: 'application/xml; charset=UTF-8',
        itunesId: null,
        generator: '',
        language: 'en-us',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '5cb5ab89-d7e5-54cf-8038-43a9db430af7',
        medium: 'podcast',
        episodeCount: 12,
        imageUrlHash: 898877651,
        newestItemPubdate: 1672617600
    },
    {
        id: 4706525,
        title: 'Sophisms of the Protectionists',
        url: 'https://s3.amazonaws.com/aplt1rss/4179.rss',
        originalUrl: 'https://s3.amazonaws.com/aplt1rss/4179.rss',
        link: 'https://librivox.org/sophisms-of-the-protectionists-by-frederic-bastiat/',
        description: '"To rob the public, it is necessary to deceive them," Bastiat said and believed. He reasoned, employing repetition to various applications, against fallacious arguments promoting the "Protection" of industries to the detriment of consumers and society. \n' +
        '(Summary by Katie Riley)',
        author: 'Frédéric Bastiat',
        ownerName: 'Appletfab LLC',
        image: 'http://archive.org/download/LibrivoxCdCoverArt21/sophisms_protectionists_1208.jpg',
        artwork: 'http://archive.org/download/LibrivoxCdCoverArt21/sophisms_protectionists_1208.jpg',
        lastUpdateTime: 1641455899,
        lastCrawlTime: 1687707432,
        lastParseTime: 1687707438,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1687707432,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml',
        itunesId: null,
        generator: '',
        language: 'en',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: 'b5304cc5-0225-54d5-82fa-9d2e7ddcca69',
        medium: 'podcast',
        episodeCount: 22,
        imageUrlHash: 3408456531,
        newestItemPubdate: 1274268172
    },
    {
        id: 163321,
        title: 'Essays on Political Economy by Frédéric Bastiat (1801 - 1850)',
        url: 'https://librivox.org/rss/4073',
        originalUrl: 'https://librivox.org/rss/4073',
        link: 'https://librivox.org/essays-on-political-economy-by-frederic-bastiat/',
        description: 'Bastiat asserted that the only purpose of government is to defend the right of an individual to life, liberty, and property. From this definition, Bastiat concluded that the law cannot defend life, liberty and property if it promotes socialist policies inherently opposed to these very things. In this way, he says, the law is perverted and turned against the thing it is supposed to defend. (Introduction by Wikipedia)',
        author: 'LibriVox',
        ownerName: 'LibriVox',
        image: 'https://archive.org/download/LibrivoxCdCoverArt21/essays_political_economy_1208.jpg',
        artwork: 'https://archive.org/download/LibrivoxCdCoverArt21/essays_political_economy_1208.jpg',
        lastUpdateTime: 1713832972,
        lastCrawlTime: 1713832966,
        lastParseTime: 1713832986,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1713832966,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml; charset=utf-8',
        itunesId: 382955266,
        generator: '',
        language: 'eng',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '30f30e64-d85d-50d0-adf9-24c4ce2ca657',
        medium: 'podcast',
        episodeCount: 12,
        imageUrlHash: 3343666285,
        newestItemPubdate: 0
    },
    {
        id: 1528457,
        title: 'Sophisms of the Protectionists by Frédéric Bastiat',
        url: 'http://www.loyalbooks.com/book/Sophisms-of-the-Protectionists/feed',
        originalUrl: 'http://www.loyalbooks.com/book/Sophisms-of-the-Protectionists/feed',
        link: 'http://www.loyalbooks.com/book/Sophisms-of-the-Protectionists',
        description: '"To rob the public, it is necessary to deceive them," Bastiat said and believed. He reasoned, employing repetition to various applications, against fallacious arguments promoting the "Protection" of industries to the detriment of consumers and society. (Introduction by Katie Riley)',
        author: 'Loyal Books',
        ownerName: 'Loyal Books',
        image: 'http://www.loyalbooks.com/image/feed/Sophisms-of-the-Protectionists.jpg',
        artwork: 'http://www.loyalbooks.com/image/feed/Sophisms-of-the-Protectionists.jpg',
        lastUpdateTime: 1714478108,
        lastCrawlTime: 1714478101,
        lastParseTime: 1714478115,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1714478101,
        lastHttpStatus: 200,
        contentType: 'application/xml; charset=UTF-8',
        itunesId: null,
        generator: '',
        language: 'en-us',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '42ae658f-5fe0-5f26-8903-f61551f5c682',
        medium: 'podcast',
        episodeCount: 22,
        imageUrlHash: 1683541669,
        newestItemPubdate: 1704153600
    },
    {
        id: 6290222,
        title: 'Capital and Interest by Frédéric Bastiat',
        url: 'http://www.loyalbooks.com/book/capital-and-interest-by-frederic-bastiat/feed',
        originalUrl: 'http://www.loyalbooks.com/book/capital-and-interest-by-frederic-bastiat/feed',
        link: 'http://www.loyalbooks.com/book/capital-and-interest-by-frederic-bastiat',
        description: 'Frédéric Bastiat was an early 19th century French economist/statesman whose common sense essays tried to battle the rise of socialist ideology after the French revolution, where provisional governments were rivaling each other for power. Of central concern was who should control the money. How is wealth created? How should it be divided amongst the people? What services should government provide? Same questions we are asking now. This essay addresses the popular fallacy of the day that Capital should be available to all gratuitiously, without necessity of paying back loans, and looking upon any form of interest as Us...',
        author: 'Loyal Books',
        ownerName: 'Loyal Books',
        image: 'http://www.loyalbooks.com/image/ui/default-feed.jpg',
        artwork: 'http://www.loyalbooks.com/image/ui/default-feed.jpg',
        lastUpdateTime: 1680994111,
        lastCrawlTime: 1688166393,
        lastParseTime: 1688166402,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1688166393,
        lastHttpStatus: 200,
        contentType: '',
        itunesId: null,
        generator: '',
        language: 'en-us',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '8fa46945-33e6-53bf-97fa-c27eaebb810b',
        medium: 'podcast',
        episodeCount: 7,
        imageUrlHash: 1484841007,
        newestItemPubdate: 1672617600
    },
    {
        id: 5823676,
        title: 'The Law',
        url: 'https://www.spreaker.com/show/5704551/episodes/feed',
        originalUrl: 'https://www.spreaker.com/show/5704551/episodes/feed',
        link: 'https://www.spreaker.com/show/the-law_1',
        description: `The Law is an 1850 book by Frédéric Bastiat. It was written at Mugron two years after the third French Revolution and a few months before his death of tuberculosis at age 49. The essay was influenced by John Locke's Second Treatise on Government and in turn influenced Henry Hazlitt's Economics in One Lesson.  In The Law, Bastiat says "each of us has a natural right – from God – to defend his person, his liberty, and his property." The State is a "substitution of a common force for individual forces" to defend this right.View our full collection of podcasts at our we...`,
        author: 'Frédéric Bastiat',
        ownerName: 'Sol Good Network',
        image: 'https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/9e3004ec5836d88e12d97a8d10da9052.jpg',
        artwork: 'https://d3wo5wojvuv7l.cloudfront.net/t_rss_itunes_square_1400/images.spreaker.com/original/9e3004ec5836d88e12d97a8d10da9052.jpg',
        lastUpdateTime: 1711701698,
        lastCrawlTime: 1714293719,
        lastParseTime: 1711701708,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1711701696,
        lastHttpStatus: 200,
        contentType: '',
        itunesId: 1652566177,
        generator: '',
        language: 'en',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '2459a18a-8948-5061-8c89-5f71a1c1ad4f',
        medium: 'podcast',
        episodeCount: 10,
        imageUrlHash: 3331631323,
        newestItemPubdate: 1667333102
    },
    {
        id: 2719108,
        title: 'Clube Bastiat',
        url: 'https://feed.megafono.host/clube-bastiat',
        originalUrl: 'https://feed.megafono.host/clube-bastiat',
        link: 'https://www.megafono.host/podcast/clube-bastiat',
        description: 'Este é o podcast oficial do Clube Bastiat.Filosofia, economia e educação, liberal e libertaria.',
        author: 'Clube Bastiat',
        ownerName: 'Clube Bastiat',
        image: 'https://images.megafono.host/channel/artwork/7d95a968-b028-439a-a13e-44cab34fe71e/pp.jpg',
        artwork: 'https://images.megafono.host/channel/artwork/7d95a968-b028-439a-a13e-44cab34fe71e/pp.jpg',
        lastUpdateTime: 1618205740,
        lastCrawlTime: 1649122941,
        lastParseTime: 1649122952,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1649122941,
        lastHttpStatus: 200,
        contentType: 'application/xml; charset=utf-8',
        itunesId: null,
        generator: 'Megafono Feed v2.0.0',
        language: 'pt-BR',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: 'f3fd8b94-026c-5a80-9000-95c935721729',
        medium: 'podcast',
        episodeCount: 1,
        imageUrlHash: 3405830081,
        newestItemPubdate: 1540691940
    },
    {
        id: 2765205,
        title: 'Essays on Political Economy by BASTIAT, Frédéric',
        url: 'https://www.ivoox.com/_fg_f1226582_filtro_1.xml',
        originalUrl: 'https://www.ivoox.com/_fg_f1226582_filtro_1.xml',
        link: 'https://www.ivoox.com/podcast-essays-on-political-economy-by-bastiat-frederic_sq_f1226582_1.html',
        description: 'Bastiat asserted that the only purpose of government is to defend the right of an individual to life, liberty, and property. From this definition, Bastiat concluded that the law cannot defend life, liberty and property if it promotes socialist policies inherently opposed to these very things. In this way, he says, the law is perverted and turned against the thing it is supposed to defend. (Introduction by Wikipedia)',
        author: 'Fantasy Couch',
        ownerName: '',
        image: 'https://static-2.ivoox.com/canales/9/8/9/3/5851470043989_XXL.jpg',
        artwork: 'https://static-2.ivoox.com/canales/9/8/9/3/5851470043989_XXL.jpg',
        lastUpdateTime: 1623239609,
        lastCrawlTime: 1648380460,
        lastParseTime: 1648380471,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1648380460,
        lastHttpStatus: 200,
        contentType: 'text/xml; charset=utf-8',
        itunesId: null,
        generator: 'iVoox',
        language: 'en',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '30477935-51c9-5f8a-8170-cf19a24ab07d',
        medium: 'podcast',
        episodeCount: 20,
        imageUrlHash: 545952302,
        newestItemPubdate: 1517475955
    },
    {
        id: 5396325,
        title: 'Bastiat, Frederic',
        url: 'https://www.ivoox.com/_fg_f132023_filtro_1.xml',
        originalUrl: 'https://www.ivoox.com/_fg_f132023_filtro_1.xml',
        link: 'https://www.ivoox.com/podcast-bastiat-frederic_sq_f132023_1.html',
        description: 'Principalmente, trataré de subir audiolibros realizados por mi, aunque con voz artificial, ya que no pude encontrarlos en la Red.',
        author: 'LeRebel',
        ownerName: '',
        image: 'https://static-1.ivoox.com/canales/6/1/0/2/3901470902016_XXL.jpg',
        artwork: 'https://static-1.ivoox.com/canales/6/1/0/2/3901470902016_XXL.jpg',
        lastUpdateTime: 1651001785,
        lastCrawlTime: 1651001782,
        lastParseTime: 1651001786,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1651001782,
        lastHttpStatus: 200,
        contentType: '',
        itunesId: null,
        generator: 'iVoox',
        language: 'es-ES',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '9125d445-8095-5845-9ce7-f4747f67cffb',
        medium: 'podcast',
        episodeCount: 5,
        imageUrlHash: 2284830206,
        newestItemPubdate: 1328219182
    },
    {
        id: 5394611,
        title: 'Ley, la. Frederic Bastiat',
        url: 'https://www.ivoox.com/_fg_f128077_filtro_1.xml',
        originalUrl: 'https://www.ivoox.com/_fg_f128077_filtro_1.xml',
        link: 'https://www.ivoox.com/podcast-ley-la-frederic-bastiat_sq_f128077_1.html',
        description: 'Principalmente, trataré de subir audiolibros realizados por mi, aunque con voz artificial, ya que no pude encontrarlos en la Red.',
        author: 'LeRebel',
        ownerName: '',
        image: 'https://static-1.ivoox.com/canales/0/7/9/3/7631470903970_XXL.jpg',
        artwork: 'https://static-1.ivoox.com/canales/0/7/9/3/7631470903970_XXL.jpg',
        lastUpdateTime: 1650991657,
        lastCrawlTime: 1650991652,
        lastParseTime: 1650991658,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1650991652,
        lastHttpStatus: 200,
        contentType: '',
        itunesId: null,
        generator: 'iVoox',
        language: 'es-ES',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '8a19ff6f-1c0e-5b97-a41b-e30f3fc9259d',
        medium: 'podcast',
        episodeCount: 5,
        imageUrlHash: 3828895961,
        newestItemPubdate: 1323037388
    },
    {
        id: 4589201,
        title: 'Essays on Political Economy',
        url: 'https://s3.amazonaws.com/aplt1rss/4073.rss',
        originalUrl: 'https://s3.amazonaws.com/aplt1rss/4073.rss',
        link: 'https://librivox.org/essays-on-political-economy-by-frederic-bastiat/',
        description: 'Bastiat asserted that the only purpose of government is to defend the right of an individual to life, liberty, and property. From this definition, Bastiat concluded that the law cannot defend life, liberty and property if it promotes socialist policies inherently opposed to these very things. In this way, he says, the law is perverted and turned against the thing it is supposed to defend. (Introduction by Wikipedia)',
        author: 'Frédéric Bastiat',
        ownerName: 'Appletfab LLC',
        image: 'http://archive.org/download/LibrivoxCdCoverArt21/essays_political_economy_1208.jpg',
        artwork: 'http://archive.org/download/LibrivoxCdCoverArt21/essays_political_economy_1208.jpg',
        lastUpdateTime: 1639521557,
        lastCrawlTime: 1648835344,
        lastParseTime: 1639521574,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1639521501,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml',
        itunesId: null,
        generator: null,
        language: 'en',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '8fcf2fa9-8a8e-5c94-94b5-d10b9195f966',
        medium: 'podcast',
        episodeCount: 12,
        imageUrlHash: 3343666285,
        newestItemPubdate: 1268710972
    },
    {
        id: 1073253,
        title: 'The Law',
        url: 'https://cdn.mises.org/itunes/en_407.xml',
        originalUrl: 'https://cdn.mises.org/itunes/en_407.xml',
        link: '',
        description: 'The Law applies in every way to our own time, which is precisely why so many people credit this one essay for showing them the light of liberty. Narrated by Floy Lilley.',
        author: 'Claude Frédéric Bastiat',
        ownerName: 'Mises Institute',
        image: 'https://cdn.mises.org/TheLaw_300.png',
        artwork: 'https://cdn.mises.org/TheLaw_300.png',
        lastUpdateTime: 1713450766,
        lastCrawlTime: 1713450759,
        lastParseTime: 1713450776,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1713450759,
        lastHttpStatus: 200,
        contentType: 'application/xml',
        itunesId: 380694913,
        generator: '',
        language: 'en-US',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: null,
        locked: 0,
        explicit: false,
        podcastGuid: 'b48be630-5d52-56a3-938f-370a930e2681',
        medium: 'podcast',
        episodeCount: 1,
        imageUrlHash: 2044485895,
        newestItemPubdate: 1223528400
    },
    {
        id: 841225,
        title: 'Sophisms of the Protectionists by Frédéric Bastiat (1801 - 1850)',
        url: 'https://librivox.org/rss/4179',
        originalUrl: 'https://librivox.org/rss/4179',
        link: 'https://librivox.org/sophisms-of-the-protectionists-by-frederic-bastiat/',
        description: '"To rob the public, it is necessary to deceive them," Bastiat said and believed. He reasoned, employing repetition to various applications, against fallacious arguments promoting the "Protection" of industries to the detriment of consumers and society. (Summary by Katie Riley)',
        author: 'LibriVox',
        ownerName: 'LibriVox',
        image: '',
        artwork: '',
        lastUpdateTime: 1622913359,
        lastCrawlTime: 1649279674,
        lastParseTime: 1649279685,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1649279674,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml; charset=utf-8',
        itunesId: 383537921,
        generator: '',
        language: '',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: 'f9d9caa6-2518-580e-bf25-576bb2cc7b3d',
        medium: 'podcast',
        episodeCount: 22,
        imageUrlHash: 0,
        newestItemPubdate: 0
    },
    {
        id: 1519326,
        title: 'Law, The by Frédéric Bastiat (1801 - 1850)',
        url: 'https://librivox.org/rss/15134',
        originalUrl: 'https://librivox.org/rss/15134',
        link: 'https://librivox.org/the-law-by-frederic-bastiat/',
        description: '"The law perverted! The law—and, in its wake, all the collective forces of the nation. The law, I say, not only diverted from its proper direction, but made to pursue one entirely contrary! The law becomes the tool of every kind of avarice, instead of being its check! The law guilty of that very inequity which it was its mission to punish! Truly, this is a serious fact, if it exists, and one to which I feel bound to call the attention of my fellow-citizens." —Frédéric Bastiat',
        author: 'LibriVox',
        ownerName: 'LibriVox',
        image: '',
        artwork: '',
        lastUpdateTime: 1623048999,
        lastCrawlTime: 1648330755,
        lastParseTime: 1648330757,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1648330755,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml; charset=utf-8',
        itunesId: 0,
        generator: '',
        language: '',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: 'fa14ae3a-b2ab-5773-a710-2beda51f58d2',
        medium: 'podcast',
        episodeCount: 10,
        imageUrlHash: 0,
        newestItemPubdate: 0
    },
    {
        id: 1919174,
        title: 'Capital and Interest by Frédéric Bastiat (1801 - 1850)',
        url: 'https://librivox.org/rss/14246',
        originalUrl: 'https://librivox.org/rss/14246',
        link: 'https://librivox.org/capital-and-interest-by-frederic-bastiat/',
        description: 'Frédéric Bastiat was an early 19th century French economist/statesman whose common sense essays tried to battle the rise of socialist ideology after the French revolution, where provisional governments were rivaling each other for power. Of central concern was who should control the money. How is wealth created? How should it be divided amongst the people? What services should government provide? Same questions we are asking now. This essay addresses the popular fallacy of the day that Capital should be available to all gratuitiously, without necessity of paying back loans, and looking upon any form of interest as Us...',
        author: 'LibriVox',
        ownerName: 'LibriVox',
        image: '',
        artwork: '',
        lastUpdateTime: 1623112326,
        lastCrawlTime: 1648347795,
        lastParseTime: 1648347799,
        inPollingQueue: 0,
        priority: -1,
        lastGoodHttpStatusTime: 1648347795,
        lastHttpStatus: 200,
        contentType: 'application/rss+xml; charset=utf-8',
        itunesId: null,
        generator: '',
        language: '',
        type: 0,
        dead: 0,
        crawlErrors: 0,
        parseErrors: 0,
        categories: [Object],
        locked: 0,
        explicit: false,
        podcastGuid: '9a27d60a-2de7-5227-94e9-2d6b69801146',
        medium: 'podcast',
        episodeCount: 7,
        imageUrlHash: 0,
        newestItemPubdate: 0
    }
    ],
    count: 16,
    query: 'bastiat',
    description: 'Found matching feeds.'
    }
    */

    //https://blog.logrocket.com/fetch-api-node-js/ - updated documentation

    /*
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    */
}

module.exports = bar;