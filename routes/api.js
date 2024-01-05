var express = require('express');
// Expressフレームワークを読み込みます。

var mongoose = require('mongoose');
// Mongoose（MongoDB用のODMライブラリ）を読み込みます。

var router = express.Router();
// 新しいExpressルーターを作成します。

/* display game. */
router.get('/game/:id', async (req, res) => {
    // 特定のゲームを取得するためのGETリクエストのルートを定義します。
    var id = req.params.id;
    // リクエストからゲームIDを取得します。
    mongoose.model('Game').findById(id, function(err, game) {
        // IDに基づいてゲームを検索します。
        if(err) {
            // エラーが発生した場合、500（サーバーエラー）を返します。
            res.status(500).end();
        }
        if (game == null){
            // ゲームが見つからない場合、404（見つからない）を返します。
            res.status(404).end();
        } else {
            // ゲームが見つかった場合、ゲームの情報を返します。
            res.send(game);
        }
    });
});

/* display user. */
router.get('/user/:name', async (req, res) => {
    // 特定のユーザーを取得するためのGETリクエストのルートを定義します。
    var name = req.params.name;
    // リクエストからユーザー名を取得します。
    mongoose.model('User').findOne({name: name}, function(err, user) {
        // 名前に基づいてユーザーを検索します。
        if(err) {
            // エラーが発生した場合、500（サーバーエラー）を返します。
            res.status(500).end();
        }
        if (user == null){
            // ユーザーが見つからない場合、404（見つからない）を返します。
            res.status(404).end();
        } else {
            // ユーザーが見つかった場合、ユーザーの情報を返します。
            res.send({
                id: user._id,
                name: user.name,
                email: user.email,
                lastConnection: user.lastConnection
            });
        }
    });
});

/* api status, for monitor */
router.get('/', (req, res) => {
    // APIのステータスをチェックするためのGETリクエストのルートを定義します。
    res.status(200).end();
    // 正常に動作していることを示すために200（成功）を返します。
});

module.exports = router;
// 定義したルーターをエクスポートします。
