var express = require('express');
const { defaultProvider } = require("@aws-sdk/credential-provider-node"); // V3 SDK
const { Client } = require('@opensearch-project/opensearch');
const { AwsSigv4Signer } = require('@opensearch-project/opensearch/aws');

const client = new Client({
 ...AwsSigv4Signer({
   region: 'us-east-1', 
   service: 'es',  
   getCredentials: () => {
     const credentialsProvider = defaultProvider();
     return credentialsProvider();
   },
 }),
 node: 'https://search-game-ws-q7zmcbu77egwwwobsncuukjwuq.us-east-1.es.amazonaws.com' 
});

var router = express.Router();

router.get('/', function(req, res) {
 // omitted for brevity
});

router.post('/', async function(req, res) {

 var body = {
   query: {
     term: {
       white: req.body.white
     }
   }
 };

 try {
   var results = await client.search({
     index: 'chesshub',
     body: body
   });
   
   var games = results.hits.hits;

   res.status(200).json({games});
   
 } catch(err) {
   res.status(500).send(err);
 }

});

module.exports = router;