var express = require('express');
// Expressフレームワークを読み込みます。

var elasticsearch = require('elasticsearch');
// Elasticsearchクライアントライブラリを読み込みます。

var client = new elasticsearch.Client(); // default to localhost:9200
// Elasticsearchクライアントを初期化します。デフォルトの設定では、localhostのポート9200に接続します。

var router = express.Router();
// 新しいExpressルーターを作成します。

router.get('/', function(req, res) {
    // 検索ページのGETリクエストのルートを定義します。
    res.render('partials/search', {
        // searchテンプレートをレンダリングします。
        title: 'Chess Hub - Search',
        user: req.user,
        isSearchPage: true
        // レンダリングに必要な変数を設定します。
    });
});

router.post('/', function(req, res) {
    // 検索フォームのPOSTリクエストのルートを定義します。
    var white = req.body.white;
    var black = req.body.black;
    var content = req.body.content;
    var result = req.body.result;
    // リクエストから検索パラメータを取得します。

    client.search({
        // Elasticsearchクライアントを使って検索を実行します。
        index: 'chesshub',
        type: 'game',
        body: {
            "query": {
                "bool": {
                    "should": [
                        { "match": { "white":  white }},
                        { "match": { "black": black }},
                        { "match": { "content": content }},
                        { "match": { "result": result }}
                    ]
                    // 検索クエリを定義します。white, black, content, resultフィールドでのマッチングを行います。
                }
            }
        }
    }).then(function (resp) {
            var games = resp.hits.hits;
            // 検索結果を取得します。
            res.set('Content-Type', 'application/json');
            // 応答のContent-TypeをJSONに設定します。
            res.status(200);
            // HTTPステータスコード200（OK）を設定します。
            res.send({ games: games });
            // 検索結果をJSON形式で送信します。
        }, function (err) {
            // 検索中にエラーが発生した場合。
            res.status(500);
            // HTTPステータスコード500（サーバーエラー）を設定します。
            console.log(err);
            // エラーをログに出力します。
        });
});

module.exports = router;
// 定義したルーターをエクスポートします。
