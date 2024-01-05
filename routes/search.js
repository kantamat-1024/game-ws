var express = require('express');
const { defaultProvider } = require("@aws-sdk/credential-provider-node"); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');



const client = new Client({
    ...AwsSigv4Signer({
      region: 'us-east-1',
      service: 'es',  // 'aoss' for OpenSearch Serverless
      // Must return a Promise that resolve to an AWS.Credentials object.
      // This function is used to acquire the credentials when the client start and
      // when the credentials are expired.
      // The Client will refresh the Credentials only when they are expired.
      // With AWS SDK V2, Credentials.refreshPromise is used when available to refresh the credentials.
  
      // Example with AWS SDK V3:
      getCredentials: () => {
        // Any other method to acquire a new Credentials object can be used.
        const credentialsProvider = defaultProvider();
        return credentialsProvider();
      },
    }),
    node: 'https://search-game-ws-q7zmcbu77egwwwobsncuukjwuq.us-east-1.es.amazonaws.com', // OpenSearchエンドポイント
    auth: {
        username: 'opensearch',
        password: 'Opensearch0!'
    }
});

var router = express.Router();

router.get('/', function (req, res) {
  res.render('partials/search', {
    title: 'Chess Hub - Search', 
    user: req.user,
    isSearchPage: true
  });
});

router.post('/', async function(req, res) { // async/awaitを使用

  var body = {
    query: {
      term: {
        white: req.body.white
      }
    }
  };
  
  try {
    var results = await client.search({ // awaitを使用して非同期処理を待機
      index: 'chesshub',
      body: body
    });
    
    var games = results.hits.hits;

    res.set('Content-Type', 'application/json');
    res.status(200);
    res.send({games: games});
    
  } catch(err) {
    res.status(500);
    console.log(err);
  }
  
});

module.exports = router;