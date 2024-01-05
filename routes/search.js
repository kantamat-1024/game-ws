var express = require('express');
const { defaultProvider } = require("@aws-sdk/credential-provider-node"); // V3 SDK.
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
    ...AwsSigv4Signer({
      region: process.env.AWS_REGION || 'us-east-1',  
      service: process.env.SERVICE || 'es',
      getCredentials: () => {
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