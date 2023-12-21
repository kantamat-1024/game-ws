var express = require('express');
// Expressフレームワークを読み込みます。

var mongoose = require('mongoose');
// Mongoose（MongoDB用のODMライブラリ）を読み込みます。

var passport = require('passport');
// Passport認証ミドルウェアを読み込みます。

var util = require('../config/util.js');
// 暗号化やその他ユーティリティ関数を含むutil.jsモジュールを読み込みます。

var User = mongoose.model('User');
// Mongooseを通じてUserモデルを取得します。

var router = express.Router();
// 新しいExpressルーターを作成します。

router.get('/', function(req, res) {
    // ユーザー登録ページのGETリクエストのルートを定義します。
    var errors = req.flash('error');
    // エラーメッセージをフラッシュから取得します。
    var error = '';
    if (errors.length) {
        error = errors[0];
        // 最初のエラーメッセージを取得します。
    }

    res.render('partials/register', {
        // registerテンプレートをレンダリングします。
        title: 'Chess Hub - Register',
        error: error,
        isLoginPage: true
        // レンダリングに必要な変数を設定します。
    });
});

router.post('/', function(req, res, next) {
    // ユーザー登録フォームのPOSTリクエストのルートを定義します。
    var email = req.body.email;
    var name = req.body.userName;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    // フォームから情報を取得します。

    User.findOne({email: email}, function (err, user) {
        // メールアドレスに基づいてユーザーを検索します。
        if (user !== null) {
            // ユーザーが既に存在する場合。
            req.flash('registerStatus', false);
            req.flash('error', 'We have already an account with email: ' + email);
            res.redirect('/register');
        } else { // no user found
            // ユーザーが存在しない場合。
            if(password === confirmPassword) {
                // パスワードが一致する場合。
                var u = new User({ name: name, email: email, password: util.encrypt(password) });
                // 新しいユーザーオブジェクトを作成し、パスワードを暗号化します。
                u.save(function (err) {
                    // ユーザーをデータベースに保存します。
                    if (err) {
                        next(err);
                        // エラーが発生した場合、エラー処理を行います。
                    } else {
                        console.log('new user:' + u);
                        req.login(u, function(err) {
                            // ユーザーをログインさせます。
                            if (err) { return next(err); }
                            req.flash('registerStatus', true);
                            req.flash('registerSuccessMessage', 'Welcome ' + u.name + "!");
                            return res.redirect('/');
                            // 登録成功のメッセージを設定し、ホームページにリダイレクトします。
                        });
                    }
                });
            } else {
                // パスワードが一致しない場合。
                req.flash('registerStatus', false);
                req.flash('error', 'The confirmation password does not match the password');
                res.redirect('/register');
                // エラーメッセージを設定し、登録ページにリダイレクトします。
            }
        }
    });
});

module.exports = router;
// 定義したルーターをエクスポートします。
