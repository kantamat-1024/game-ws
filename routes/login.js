var express = require('express');
// Expressフレームワークを読み込みます。

var mongoose = require('mongoose');
// Mongoose（MongoDB用のODMライブラリ）を読み込みます。

var passport = require('passport');
// Passport認証ミドルウェアを読み込みます。

var User = mongoose.model('User');
// Mongooseを通じてUserモデルを取得します。

var router = express.Router();
// 新しいExpressルーターを作成します。

router.get('/', function(req, res) {
    // ログインページのGETリクエストのルートを定義します。
    var errors = req.flash('error');
    // エラーメッセージをフラッシュから取得します。
    var error = '';
    if (errors.length) {
        error = errors[0];
        // 最初のエラーメッセージを取得します。
    }

    res.render('partials/login', {
        // loginテンプレートをレンダリングします。
        title: 'Chess Hub - Login',
        error: error,
        isLoginPage: true
        // レンダリングに必要な変数を設定します。
    });
});

router.post('/',
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    // ログインフォームのPOSTリクエストを処理し、Passportで認証します。
    function(req, res) {
        // 認証に成功した後の処理。
        User.findOneAndUpdate({_id: req.user._id}, { lastConnection: new Date() }, {}, function (err, user) {
            // ユーザーの最終接続日時を更新します。
            req.flash('welcomeMessage', 'Welcome ' + user.name + '!');
            // 歓迎メッセージをフラッシュに設定します。
            res.redirect('/');
            // ホームページにリダイレクトします。
        });
    });

module.exports = router;
// 定義したルーターをエクスポートします。
