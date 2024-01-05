var express = require('express');
// Expressフレームワークを読み込みます。

var mongoose = require('mongoose');
// Mongoose（MongoDB用のODMライブラリ）を読み込みます。

var passport = require('passport');
// Passport認証ミドルウェアを読み込みます。

var util = require('../config/util.js');
// ユーティリティ関数を含むutil.jsモジュールを読み込みます。

var User = mongoose.model('User');
// Mongooseを通じてUserモデルを取得します。

var router = express.Router();
// 新しいExpressルーターを作成します。

router.get('/', async (req, res) => {
    // ホームページのルートを定義します。
   mongoose.model('Quote').find({}, function(err, quotes) {
        // すべての名言をデータベースから取得します。
        var randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        // ランダムに1つの名言を選択します。
        mongoose.model('Puzzle').find({}, function(err, puzzles) {
            // すべてのパズルをデータベースから取得します。
            var randomPuzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
            // ランダムに1つのパズルを選択します。
            var logoutSuccessMessage = req.flash('logoutSuccess');
            var welcomeMessage = req.flash('welcomeMessage');
            var registerSuccessMessage = req.flash('registerSuccessMessage');
            // フラッシュメッセージを取得します。
            res.render('partials/index', {
                // indexテンプレートをレンダリングします。
                title: 'Chess Hub',
                quote: randomQuote,
                puzzle: randomPuzzle,
                logoutSuccessMessage: logoutSuccessMessage,
                welcomeMessage: welcomeMessage,
                registerSuccessMessage: registerSuccessMessage,
                user: req.user,
                isHomePage: true
            });
        });
    });
});

router.get('/game/:token/:side', (req, res) => {
    // 特定のゲームを表示するルートを定義します。
    var token = req.params.token;
    var side = req.params.side;
    // URLからゲームトークンとプレイヤーのサイドを取得します。
    res.render('partials/game', {
        // gameテンプレートをレンダリングします。
        title: 'Chess Hub - Game ' + token,
        user: req.user,
        isPlayPage: true,
        token: token,
        side: side
    });
});

router.get('/logout', (req, res) => {
    // ログアウト処理のルートを定義します。
    req.logout();
    // Passportを使用してユーザーをログアウトします。
    req.flash('logoutSuccess', 'You have been successfully logged out');
    // ログアウト成功のメッセージをフラッシュに設定します。
    res.redirect('/');
    // ホームページにリダイレクトします。
});

router.get('/tv', function(req, res) {
    // TVページのルートを定義します。
    res.render('partials/tv', {
        // tvテンプレートをレンダリングします。
        title: 'Chess Hub - Tv',
        user: req.user,
        isTvPage: true,
        opponent1: 'V. Anand',
        opponent2: 'G. Kasparov'
    });
});

router.get('/monitor', function(req, res) {
    // システムのモニタリングページのルートを定義します。
    // todo: ここでMongoDB、Elasticsearch、APIのステータスをチェックする処理を実装します。

    var mongoStatus = "success", mongoIcon = "smile";
    var apiStatus = "success", apiIcon = "smile";
    var esStatus = "success", esIcon = "smile";
    // 現時点では、すべてのサービスのステータスを「成功」としています。
    res.render('partials/monitor', {
        // monitorテンプレートをレンダリングします。
        title: 'Chess Hub - Monitor',
        user: req.user,
        status: {
            mongo: mongoStatus,
            api: apiStatus,
            es: esStatus
        },
        icon: {
            mongo: mongoIcon,
            api: apiIcon,
            es: esIcon
        }
    });
});

module.exports = router;
// 定義したルーターをエクスポートします。
