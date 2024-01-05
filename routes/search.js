var express = require('express');
const OpenSearch = require('@opensearch-project/opensearch');

const client = new OpenSearch.Client({
  node: 'https://search-game-ws-q7zmcbu77egwwwobsncuukjwuq.us-east-1.es.amazonaws.com',
  auth: {
    username: 'opensearch',
    password: 'Opensearch0!'  
  }
});

// Expressルーター
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('search'); 
});

router.post('/', (req, res) => {

  const {white, black, content, result} = req.body;
  
  const query = {
    query: {
      bool: {
        should: [
          {match: {white}}, 
          {match: {black}},
          {match: {content}},
          {match: {result}}
        ]
      }
    }
  };

  client.search({
    index: 'chesshub', 
    body: query
  })
  .then(resp => {
    const games = resp.hits.hits;
    res.json({games}); 
  })
  .catch(err => {
    console.error(err);
    res.status(500).end();
  });

});

module.exports = router;