var express = require('express');
// Expressフレームワークを読み込みます。

var util = require('../config/util.js');
// 暗号化やその他ユーティリティ関数を含むutil.jsモジュールを読み込みます。

var router = express.Router();
// 新しいExpressルーターを作成します。

router.get('/', function(req, res) {
    // 「ゲームをプレイする」ページのGETリクエストのルートを定義します。
    res.render('partials/play', {
        // playテンプレートをレンダリングします。
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
        // レンダリングに必要な変数を設定します。
    });
});

router.post('/', function(req, res) {
    // 新しいゲームセッションを開始するPOSTリクエストのルートを定義します。
    var side = req.body.side;
    // リクエストからユーザーが選択したサイド（白または黒）を取得します。
    // var opponent = req.body.opponent; // AIとの対戦は未実装です。
    var token = util.randomString(20);
    // 20文字のランダムなトークンを生成します。
    res.redirect('/game/' + token + '/' + side);
    // 生成したトークンとユーザーが選択したサイドを含むURLにリダイレクトします。
});

module.exports = router;
// 定義したルーターをエクスポートします。
