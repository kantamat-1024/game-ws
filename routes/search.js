var express = require('express');

var opensearch = require('@opensearch-project/opensearch');

// OpenSearchに接続する設定
var client = new opensearch.Client({
    nodes: [
        'https://search-game-ws-q7zmcbu77egwwwobsncuukjwuq.us-east-1.es.amazonaws.com'
      ],
    auth: {
        username: 'opensearch',
        password: 'Opensearch0!'
    },
    log: 'trace'
});

var router = express.Router();

router.get('/', function (req, res) {
    res.render('partials/search', {
        title: 'Chess Hub - Search',
        user: req.user,
        isSearchPage: true
    });
});

router.post('/', function (req, res) {

    var body = {
        query: {
            term: {
                white: req.body.white
            }
        }
    };

    client.search({
        index: 'chesshub',
        body: body
    }).then(function (resp) {
        var games = resp.hits.hits;

        res.set('Content-Type', 'application/json');
        res.status(200);
        res.send({ games: games });
    }).catch(function (err) {
        res.status(500);
        console.log(err);
    });

});

module.exports = router;